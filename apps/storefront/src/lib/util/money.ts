import { isEmpty } from "./isEmpty"

type ConvertToLocaleParams = {
  amount: number
  currency_code?: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}

/**
 * Indonesian Rupiah display: Rp 1.234.567 (dot thousands separator, no decimals).
 */
export function formatRupiah(amount: number): string {
  if (!Number.isFinite(amount)) {
    return "Rp 0"
  }

  const rounded = Math.round(amount)
  const abs = Math.abs(rounded)
  const formatted = abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")

  return rounded < 0 ? `-Rp ${formatted}` : `Rp ${formatted}`
}

/** Currency label for UI chrome (top bar, selects). */
export function formatCurrencyLabel(_currencyCode?: string): string {
  return "Rp"
}

/**
 * Re-format legacy Intl currency strings (IDR, $, commas) to Rp style.
 */
export function normalizeCurrencyDisplay(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) {
    return trimmed
  }

  if (/^Rp\s/i.test(trimmed)) {
    return trimmed.replace(/,(\d{2})$/, "").replace(/,(\d{3})/g, ".$1")
  }

  const digits = trimmed.replace(/[^\d.-]/g, "")
  if (!digits || digits === "-" || digits === ".") {
    return trimmed
  }

  const amount = Number.parseFloat(digits)
  if (!Number.isFinite(amount)) {
    return trimmed
  }

  return formatRupiah(amount)
}

export const convertToLocale = ({
  amount,
  currency_code: _currency_code,
}: ConvertToLocaleParams) => {
  if (_currency_code && isEmpty(_currency_code)) {
    return amount.toString()
  }

  return formatRupiah(amount)
}
