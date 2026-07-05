import {
  AbstractPaymentProvider,
  BigNumber,
  MedusaError,
  PaymentActions,
  PaymentSessionStatus,
} from "@medusajs/framework/utils"
import type {
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  InitiatePaymentInput,
  InitiatePaymentOutput,
  Logger,
  ProviderWebhookPayload,
  RefundPaymentInput,
  RefundPaymentOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
  WebhookActionResult,
} from "@medusajs/framework/types"
import {
  ensureXenditConfigLoaded,
  type XenditRuntimeConfig,
} from "../xendit-config/runtime-config"
import { XenditClient, type XenditInvoice } from "./client"
import { fromXenditAmount, toXenditAmount } from "./utils"
import {
  isInvoicePaid,
  parseWebhookInvoice,
  resolvePaymentSessionId,
} from "./webhook"

export type XenditOptions = Record<string, never>

type InjectedDependencies = {
  logger: Logger
}

type XenditSessionData = {
  id: string
  invoice_url?: string
  status?: string
  session_id?: string
  currency_code?: string
}

class XenditPaymentProviderService extends AbstractPaymentProvider<XenditOptions> {
  static identifier = "xendit"

  protected logger_: Logger
  protected options_: XenditOptions
  protected client_: XenditClient | null = null
  protected clientSecretKey_: string | null = null

  constructor(container: InjectedDependencies, options: XenditOptions) {
    super(container, options)
    this.logger_ = container.logger
    this.options_ = options
  }

  static validateOptions() {
    // Configuration is managed via Admin → Settings → Xendit
  }

  /**
   * Resolves Xendit credentials without throwing. Used when cleaning up
   * payment sessions during cart updates (add/remove line items).
   */
  private async tryGetConfig(): Promise<XenditRuntimeConfig | null> {
    try {
      const config = await ensureXenditConfigLoaded()

      if (!config.secretKey) {
        return null
      }

      return config
    } catch {
      return null
    }
  }

  private async getConfig(): Promise<XenditRuntimeConfig> {
    const config = await this.tryGetConfig()

    if (!config?.secretKey || !config.webhookToken) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Xendit is not configured. Open Admin → Settings → Xendit to add your Secret API Key and Webhook token."
      )
    }

    if (!config.isEnabled) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Xendit is disabled. Enable it in Admin → Settings → Xendit."
      )
    }

    return config
  }

  private async expireInvoiceIfPossible(
    invoiceId: string,
    existingData: Record<string, unknown>
  ): Promise<DeletePaymentOutput> {
    const config = await this.tryGetConfig()

    if (!config) {
      return { data: existingData }
    }

    try {
      const client = this.getClient(config.secretKey)
      const invoice = await client.expireInvoice(invoiceId)
      return { data: this.sessionDataFromInvoice(invoice) }
    } catch (error) {
      this.logger_.warn(
        `Xendit expire invoice skipped for ${invoiceId}: ${(error as Error).message}`
      )
      return { data: existingData }
    }
  }

  private getClient(secretKey: string): XenditClient {
    if (!this.client_ || this.clientSecretKey_ !== secretKey) {
      this.client_ = new XenditClient(secretKey)
      this.clientSecretKey_ = secretKey
    }

    return this.client_
  }

  private mapInvoiceStatus(
    invoice: XenditInvoice
  ): PaymentSessionStatus {
    switch (invoice.status) {
      case "PAID":
      case "SETTLED":
        return PaymentSessionStatus.AUTHORIZED
      case "EXPIRED":
        return PaymentSessionStatus.CANCELED
      default:
        return PaymentSessionStatus.PENDING
    }
  }

  private sessionDataFromInvoice(
    invoice: XenditInvoice,
    sessionId?: string,
    currencyCode?: string
  ): XenditSessionData {
    const resolvedSessionId =
      sessionId ??
      resolvePaymentSessionId(invoice) ??
      (invoice.metadata?.session_id as string | undefined)

    return {
      id: invoice.id,
      invoice_url: invoice.invoice_url,
      status: invoice.status,
      session_id: resolvedSessionId,
      currency_code: currencyCode ?? invoice.currency?.toLowerCase(),
    }
  }

  async initiatePayment(
    input: InitiatePaymentInput
  ): Promise<InitiatePaymentOutput> {
    const config = await this.getConfig()
    const client = this.getClient(config.secretKey)

    const { amount, currency_code, data, context } = input
    const sessionId = data?.session_id as string | undefined
    const externalId = sessionId || `medusa-${Date.now()}`

    const customer = context?.customer
    const xenditAmount = toXenditAmount(amount, currency_code)

    const successUrl =
      (data?.success_redirect_url as string | undefined) ||
      config.successRedirectUrl
    const failureUrl =
      (data?.failure_redirect_url as string | undefined) ||
      config.failureRedirectUrl

    const invoice = await client.createInvoice({
      external_id: externalId,
      amount: xenditAmount,
      currency: currency_code.toUpperCase(),
      description: (data?.description as string) || "Order payment",
      invoice_duration: config.invoiceDurationSeconds,
      success_redirect_url: successUrl,
      failure_redirect_url: failureUrl,
      customer: customer
        ? {
            given_names: customer.first_name ?? undefined,
            surname: customer.last_name ?? undefined,
            email: customer.email ?? undefined,
            mobile_number: customer.phone ?? undefined,
          }
        : undefined,
      metadata: {
        session_id: sessionId,
        ...(data?.metadata as Record<string, unknown> | undefined),
      },
    })

    const status = this.mapInvoiceStatus(invoice)

    return {
      id: invoice.id,
      data: this.sessionDataFromInvoice(invoice, sessionId, currency_code),
      status,
    }
  }

  async authorizePayment(
    input: AuthorizePaymentInput
  ): Promise<AuthorizePaymentOutput> {
    const status = await this.getPaymentStatus(input)

    // Paid invoices are captured at Xendit — report CAPTURED so Medusa records payment.
    if (status.status === PaymentSessionStatus.AUTHORIZED) {
      const invoiceStatus = (status.data as XenditSessionData | undefined)?.status
      if (isInvoicePaid(invoiceStatus)) {
        return {
          status: PaymentSessionStatus.CAPTURED,
          data: status.data ?? input.data,
        }
      }
    }

    return {
      status: status.status,
      data: status.data ?? input.data,
    }
  }

  async getPaymentStatus(
    input: GetPaymentStatusInput
  ): Promise<GetPaymentStatusOutput> {
    const config = await this.getConfig()
    const client = this.getClient(config.secretKey)

    const invoiceId = input.data?.id as string | undefined

    if (!invoiceId) {
      return { status: PaymentSessionStatus.PENDING }
    }

    const invoice = await client.getInvoice(invoiceId)
    const status = this.mapInvoiceStatus(invoice)

    return {
      status,
      data: this.sessionDataFromInvoice(
        invoice,
        input.data?.session_id as string | undefined,
        input.data?.currency_code as string | undefined
      ),
    }
  }

  async capturePayment(
    input: CapturePaymentInput
  ): Promise<CapturePaymentOutput> {
    const config = await this.getConfig()
    const client = this.getClient(config.secretKey)

    const invoiceId = input.data?.id as string | undefined

    if (!invoiceId) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "No Xendit invoice ID provided for capture."
      )
    }

    const invoice = await client.getInvoice(invoiceId)

    if (invoice.status !== "PAID" && invoice.status !== "SETTLED") {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cannot capture invoice with status ${invoice.status}`
      )
    }

    return {
      data: this.sessionDataFromInvoice(invoice),
    }
  }

  async cancelPayment(input: CancelPaymentInput): Promise<CancelPaymentOutput> {
    const invoiceId = input.data?.id as string | undefined

    if (!invoiceId) {
      return { data: input.data ?? {} }
    }

    return this.expireInvoiceIfPossible(invoiceId, input.data ?? {})
  }

  async deletePayment(input: DeletePaymentInput): Promise<DeletePaymentOutput> {
    const invoiceId = input.data?.id as string | undefined

    if (!invoiceId) {
      return { data: input.data ?? {} }
    }

    return this.expireInvoiceIfPossible(invoiceId, input.data ?? {})
  }

  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentOutput> {
    this.logger_.warn(
      "Xendit refund must be processed manually in the Xendit Dashboard for invoice payments."
    )
    return { data: input.data ?? {} }
  }

  async retrievePayment(
    input: RetrievePaymentInput
  ): Promise<RetrievePaymentOutput> {
    const config = await this.getConfig()
    const client = this.getClient(config.secretKey)

    const invoiceId = input.data?.id as string | undefined

    if (!invoiceId) {
      return { data: input.data ?? {} }
    }

    const invoice = await client.getInvoice(invoiceId)
    return { data: this.sessionDataFromInvoice(invoice) }
  }

  async updatePayment(input: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
    const existingId = input.data?.id as string | undefined

    if (existingId) {
      await this.expireInvoiceIfPossible(existingId, input.data ?? {})
    }

    return this.initiatePayment(input)
  }

  async getWebhookActionAndData(
    payload: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    const config = await this.getConfig()

    const callbackToken = payload.headers["x-callback-token"]

    if (callbackToken !== config.webhookToken) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Invalid Xendit webhook callback token"
      )
    }

    const invoice = parseWebhookInvoice(payload.data)

    if (!invoice) {
      this.logger_.warn("Xendit webhook: unrecognized invoice payload shape")
      return {
        action: PaymentActions.NOT_SUPPORTED,
        data: { session_id: "", amount: new BigNumber(0) },
      }
    }

    const sessionId = resolvePaymentSessionId(invoice)
    const currency = (invoice.currency || "idr").toLowerCase()
    const amount = fromXenditAmount(invoice.amount ?? 0, currency)

    if (!sessionId) {
      this.logger_.warn(
        `Xendit webhook: missing payment session id for invoice ${invoice.id} (external_id=${invoice.external_id})`
      )
    }

    const webhookData = {
      session_id: sessionId ?? "",
      amount: new BigNumber(amount),
    }

    switch (invoice.status) {
      case "PAID":
      case "SETTLED":
        // Same as Stripe payment_intent.succeeded — authorize + capture in Medusa.
        return {
          action: PaymentActions.SUCCESSFUL,
          data: webhookData,
        }
      case "EXPIRED":
        return {
          action: PaymentActions.CANCELED,
          data: webhookData,
        }
      default:
        return {
          action: PaymentActions.NOT_SUPPORTED,
          data: webhookData,
        }
    }
  }
}

export default XenditPaymentProviderService
