import type { CalculateShippingOptionPriceDTO } from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"
import { RajaOngkirClient, type RajaOngkirShippingRate } from "./client"
import { RAJAONGKIR_COURIER_CODES } from "./service-catalog"

export type RajaOngkirRatesContext = {
  origin: string
  destination: string
  weight: number
}

const ratesCache = new Map<
  string,
  { expires: number; rates: RajaOngkirShippingRate[] }
>()
const inflight = new Map<string, Promise<RajaOngkirShippingRate[]>>()

const CACHE_TTL_MS = 60_000

function cacheKey(ctx: RajaOngkirRatesContext) {
  return `${ctx.origin}:${ctx.destination}:${ctx.weight}`
}

export function getDestinationIdFromContext(
  context: CalculateShippingOptionPriceDTO["context"]
): string {
  const metadata = context.shipping_address?.metadata as
    | Record<string, unknown>
    | undefined
  const destinationId =
    metadata?.rajaongkir_destination_id ?? metadata?.rajaongkirDestinationId

  if (!destinationId) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Select a delivery area (kelurahan/kecamatan) for RajaOngkir shipping"
    )
  }

  return String(destinationId)
}

export function getCartWeightGrams(
  context: CalculateShippingOptionPriceDTO["context"],
  defaultWeightGrams = 1000
): number {
  const total = (context.items ?? []).reduce((sum, item) => {
    const qty = Number(item.quantity ?? 1)
    const variantWeight = Number(item.variant?.weight ?? 0)
    const productWeight = Number(
      (item as { product?: { weight?: number } }).product?.weight ?? 0
    )
    const unitWeight = variantWeight || productWeight || defaultWeightGrams
    return sum + unitWeight * qty
  }, 0)

  return Math.max(defaultWeightGrams, Math.ceil(total))
}

export function findRate(
  rates: RajaOngkirShippingRate[],
  courier: string,
  service: string
): RajaOngkirShippingRate | undefined {
  return rates.find((r) => r.code === courier && r.service === service)
}

export async function fetchDomesticRates(
  client: RajaOngkirClient,
  ctx: RajaOngkirRatesContext
): Promise<RajaOngkirShippingRate[]> {
  const key = cacheKey(ctx)
  const now = Date.now()
  const cached = ratesCache.get(key)

  if (cached && cached.expires > now) {
    return cached.rates
  }

  if (inflight.has(key)) {
    return inflight.get(key)!
  }

  const promise = client
    .calculateDomesticCost({
      origin: ctx.origin,
      destination: ctx.destination,
      weight: ctx.weight,
      courier: RAJAONGKIR_COURIER_CODES,
    })
    .then((rates) => {
      ratesCache.set(key, { rates, expires: now + CACHE_TTL_MS })
      return rates
    })
    .finally(() => {
      inflight.delete(key)
    })

  inflight.set(key, promise)
  return promise
}

export function resolveRateAmount(
  rate: RajaOngkirShippingRate,
  paymentType: string
): number {
  let amount = rate.cost
  const codFee = Number(process.env.RAJAONGKIR_COD_ADMIN_FEE || 0)

  if (paymentType === "cod" && codFee > 0) {
    amount += codFee
  }

  return amount
}
