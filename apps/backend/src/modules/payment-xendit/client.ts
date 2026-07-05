export type XenditInvoiceStatus =
  | "PENDING"
  | "PAID"
  | "SETTLED"
  | "EXPIRED"

export type XenditInvoice = {
  id: string
  external_id: string
  status: XenditInvoiceStatus
  amount: number
  currency: string
  invoice_url?: string
  expiry_date?: string
  metadata?: Record<string, unknown>
}

type CreateInvoiceParams = {
  external_id: string
  amount: number
  currency: string
  description?: string
  invoice_duration?: number
  success_redirect_url?: string
  failure_redirect_url?: string
  customer?: {
    given_names?: string
    surname?: string
    email?: string
    mobile_number?: string
  }
  metadata?: Record<string, unknown>
}

export class XenditClient {
  private readonly baseUrl = "https://api.xendit.co"
  private readonly secretKey: string

  constructor(secretKey: string) {
    this.secretKey = secretKey
  }

  private get authHeader(): string {
    const encoded = Buffer.from(`${this.secretKey}:`).toString("base64")
    return `Basic ${encoded}`
  }

  private async request<T>(
    method: string,
    path: string,
    body?: Record<string, unknown>
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        Authorization: this.authHeader,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      const message =
        (data as { message?: string }).message ||
        `Xendit API error (${response.status})`
      throw new Error(message)
    }

    return data as T
  }

  async createInvoice(params: CreateInvoiceParams): Promise<XenditInvoice> {
    return this.request<XenditInvoice>("POST", "/v2/invoices", params)
  }

  async getInvoice(invoiceId: string): Promise<XenditInvoice> {
    return this.request<XenditInvoice>("GET", `/v2/invoices/${invoiceId}`)
  }

  async expireInvoice(invoiceId: string): Promise<XenditInvoice> {
    return this.request<XenditInvoice>(
      "POST",
      `/invoices/${invoiceId}/expire!`
    )
  }
}
