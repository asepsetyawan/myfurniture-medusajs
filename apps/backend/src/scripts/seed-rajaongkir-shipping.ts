import { MedusaContainer } from "@medusajs/framework"
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"
import {
  createShippingOptionsWorkflow,
  deleteShippingOptionsWorkflow,
} from "@medusajs/medusa/core-flows"
import {
  RAJAONGKIR_COURIER_SHIPPING_OPTIONS,
  RAJAONGKIR_PROVIDER_ID,
} from "../modules/fulfillment-rajaongkir/shipping-options"

export default async function seedRajaOngkirShipping({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id", "name"],
  })

  const indonesiaStockLocation = stockLocations.find((l) =>
    l.name?.toLowerCase().includes("indonesia")
  )

  if (!indonesiaStockLocation) {
    throw new Error(
      "Indonesia warehouse not found. Run seed:indonesia first."
    )
  }

  try {
    await link.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: indonesiaStockLocation.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_provider_id: RAJAONGKIR_PROVIDER_ID,
      },
    })
  } catch {
    // already linked
  }

  const { data: fulfillmentSets } = await query.graph({
    entity: "fulfillment_set",
    fields: [
      "id",
      "name",
      "service_zones.id",
      "service_zones.shipping_options.id",
      "service_zones.shipping_options.provider_id",
    ],
    filters: {
      name: "Indonesia Warehouse delivery",
    },
  })

  const indonesiaFulfillmentSet = fulfillmentSets[0]
  if (!indonesiaFulfillmentSet?.service_zones?.[0]) {
    throw new Error("Indonesia fulfillment set not found.")
  }

  const serviceZone = indonesiaFulfillmentSet.service_zones[0]

  const { data: allRajaOngkirOptions } = await query.graph({
    entity: "shipping_option",
    fields: ["id"],
    filters: { provider_id: RAJAONGKIR_PROVIDER_ID },
  })

  if (allRajaOngkirOptions.length) {
    await deleteShippingOptionsWorkflow(container).run({
      input: { ids: allRajaOngkirOptions.map((o) => o.id) },
    })
    logger.info(
      `Removed ${allRajaOngkirOptions.length} existing RajaOngkir shipping option(s).`
    )
  }

  const legacyIds =
    serviceZone.shipping_options
      ?.filter(
        (o) =>
          o?.name === "Standard Shipping" || o?.name === "Express Shipping"
      )
      .map((o) => o!.id!) ?? []

  if (legacyIds.length) {
    await deleteShippingOptionsWorkflow(container).run({
      input: { ids: legacyIds },
    })
  }

  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  })
  const shippingProfile = shippingProfiles[0]
  if (!shippingProfile) {
    throw new Error("No shipping profile found.")
  }

  await createShippingOptionsWorkflow(container).run({
    input: RAJAONGKIR_COURIER_SHIPPING_OPTIONS.map((option) => ({
      name: option.name,
      price_type: "calculated" as const,
      provider_id: RAJAONGKIR_PROVIDER_ID,
      service_zone_id: serviceZone.id,
      shipping_profile_id: shippingProfile.id,
      type: option.type,
      data: option.data,
      rules: [
        {
          attribute: "enabled_in_store",
          value: "true",
          operator: "eq",
        },
        {
          attribute: "is_return",
          value: "false",
          operator: "eq",
        },
      ],
    })),
  })

  logger.info(
    `Created ${RAJAONGKIR_COURIER_SHIPPING_OPTIONS.length} RajaOngkir shipping options (layanan + COD/non-COD).`
  )
}
