import { MathBN, BigNumber } from "@medusajs/framework/utils"

const ZERO_DECIMAL_CURRENCIES = new Set([
  "bif",
  "clp",
  "djf",
  "gnf",
  "idr",
  "jpy",
  "kmf",
  "krw",
  "mga",
  "pyg",
  "rwf",
  "ugx",
  "vnd",
  "vuv",
  "xaf",
  "xof",
  "xpf",
])

/**
 * Converts Medusa payment amount to Xendit invoice amount (integer).
 * Medusa stores amounts in major units; IDR and similar have no decimals.
 */
export function toXenditAmount(
  amount: Parameters<typeof MathBN.mult>[0],
  currencyCode: string
): number {
  const currency = currencyCode.toLowerCase()
  const numeric = new BigNumber(amount).numeric

  if (ZERO_DECIMAL_CURRENCIES.has(currency)) {
    return Math.round(numeric)
  }

  return Math.round(Number(MathBN.mult(amount, 100)))
}

export function fromXenditAmount(
  amount: number,
  currencyCode: string
): number {
  const currency = currencyCode.toLowerCase()

  if (ZERO_DECIMAL_CURRENCIES.has(currency)) {
    return amount
  }

  return amount / 100
}
