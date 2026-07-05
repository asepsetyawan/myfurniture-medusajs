import type { XenditInvoice, XenditInvoiceStatus } from "./client"

export function isMedusaPaymentSessionId(value: string | undefined): boolean {
  return !!value && (value.startsWith("payses_") || value.startsWith("ps_"))
}

export function resolvePaymentSessionId(invoice: XenditInvoice): string | undefined {
  const metadata = invoice.metadata as { session_id?: string } | undefined
  const fromMetadata = metadata?.session_id

  if (isMedusaPaymentSessionId(fromMetadata)) {
    return fromMetadata
  }

  if (isMedusaPaymentSessionId(invoice.external_id)) {
    return invoice.external_id
  }

  return undefined
}

export function isInvoicePaid(status: string | undefined): boolean {
  return status === "PAID" || status === "SETTLED"
}

/**
 * Normalizes Xendit invoice callback bodies (snake_case or camelCase).
 */
export function parseWebhookInvoice(data: unknown): XenditInvoice | null {
  if (!data || typeof data !== "object") {
    return null
  }

  const raw = data as Record<string, unknown>
  const invoice =
    typeof raw.status === "string"
      ? raw
      : (raw.data as Record<string, unknown> | undefined)

  if (!invoice || typeof invoice.status !== "string") {
    return null
  }

  const metadata = (invoice.metadata ?? {}) as Record<string, unknown>
  const externalId = String(invoice.external_id ?? invoice.externalId ?? "")
  const sessionId = resolvePaymentSessionId({
    id: String(invoice.id ?? ""),
    external_id: externalId,
    status: invoice.status as XenditInvoiceStatus,
    amount: Number(invoice.amount ?? invoice.paid_amount ?? invoice.paidAmount ?? 0),
    currency: String(invoice.currency ?? "IDR"),
    metadata: {
      ...metadata,
      session_id:
        (typeof metadata.session_id === "string" ? metadata.session_id : undefined) ??
        (isMedusaPaymentSessionId(externalId) ? externalId : undefined),
    },
  })

  return {
    id: String(invoice.id ?? ""),
    external_id: externalId,
    status: invoice.status as XenditInvoiceStatus,
    amount: Number(invoice.amount ?? invoice.paid_amount ?? invoice.paidAmount ?? 0),
    currency: String(invoice.currency ?? "IDR"),
    invoice_url: (invoice.invoice_url ?? invoice.invoiceUrl) as string | undefined,
    metadata: sessionId ? { session_id: sessionId } : metadata,
  }
}
