export function getXenditRedirectUrls(countryCode: string) {
  const base =
    process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ||
    "http://localhost:8000"

  return {
    success_redirect_url: `${base}/${countryCode}/checkout/xendit/return`,
    failure_redirect_url: `${base}/${countryCode}/checkout?step=payment`,
  }
}

export function getXenditInvoiceUrl(
  session: { data?: Record<string, unknown> } | undefined
): string | null {
  const url = session?.data?.invoice_url
  return typeof url === "string" ? url : null
}
