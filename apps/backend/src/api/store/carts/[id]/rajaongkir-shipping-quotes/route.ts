import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils"
import { RajaOngkirClient } from "../../../../../modules/fulfillment-rajaongkir/client"
import {
  fetchDomesticRates,
  findRate,
  getCartWeightGrams,
  getDestinationIdFromContext,
  resolveRateAmount,
} from "../../../../../modules/fulfillment-rajaongkir/rates"
import { RAJAONGKIR_PROVIDER_ID } from "../../../../../modules/fulfillment-rajaongkir/shipping-options"

const CART_FIELDS = [
  "id",
  "items.*",
  "items.variant.weight",
  "items.product.weight",
  "shipping_address.*",
]

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const apiKey = process.env.RAJAONGKIR_API_KEY
  const origin = process.env.RAJAONGKIR_ORIGIN_ID

  if (!apiKey || !origin) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "RajaOngkir is not configured"
    )
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const cartId = req.params.id

  const { data: carts } = await query.graph({
    entity: "cart",
    fields: CART_FIELDS,
    filters: { id: cartId },
  })

  const cart = carts[0]
  if (!cart) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "Cart not found")
  }

  if (!cart.shipping_address) {
    return res.json({ quotes: [] })
  }

  let destination: string
  try {
    destination = getDestinationIdFromContext(
      cart as Parameters<typeof getDestinationIdFromContext>[0]
    )
  } catch {
    return res.json({ quotes: [] })
  }

  const weight = getCartWeightGrams(
    cart as Parameters<typeof getCartWeightGrams>[0]
  )

  const client = new RajaOngkirClient(apiKey)
  const rates = await fetchDomesticRates(client, {
    origin,
    destination,
    weight,
  })

  const { data: shippingOptions } = await query.graph({
    entity: "shipping_option",
    fields: ["id", "name", "provider_id", "data"],
    filters: {
      provider_id: RAJAONGKIR_PROVIDER_ID,
    },
  })

  const quotes = shippingOptions
    .map((option) => {
      const data = (option.data || {}) as Record<string, string>
      const courier = data.courier
      const service = data.service
      const paymentType = data.payment_type || "prepaid"

      if (!courier || !service) {
        return null
      }

      const rate = findRate(rates, courier, service)

      if (!rate) {
        return {
          shipping_option_id: option.id,
          available: false,
          courier,
          service,
          payment_type: paymentType,
        }
      }

      return {
        shipping_option_id: option.id,
        available: true,
        courier,
        service,
        payment_type: paymentType,
        amount: resolveRateAmount(rate, paymentType),
        etd: rate.etd,
        description: rate.description,
        courier_name: rate.name,
      }
    })
    .filter(Boolean)

  res.json({ quotes, rates })
}
