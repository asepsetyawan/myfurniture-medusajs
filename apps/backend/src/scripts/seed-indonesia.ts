import { MedusaContainer } from "@medusajs/framework"
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  Modules,
} from "@medusajs/framework/utils"
import {
  createRegionsWorkflow,
  createShippingOptionsWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateProductVariantsWorkflow,
  updateRegionsWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows"

import { syncVariantInventory } from "./lib/sync-variant-inventory"
import {
  RAJAONGKIR_COURIER_SHIPPING_OPTIONS,
  RAJAONGKIR_PROVIDER_ID,
} from "../modules/fulfillment-rajaongkir/shipping-options"

const USD_TO_IDR = 16000
const EUR_TO_IDR = 17000

type RegionRef = {
  id: string
  name?: string | null
  currency_code?: string | null
  countries?: Array<{ iso_2?: string | null } | null> | null
}

type StockLocationRef = {
  id: string
  name?: string | null
}

type VariantWithPrices = {
  id: string
  prices?: Array<{
    amount?: number | string
    currency_code?: string | null
  } | null> | null
}

export default async function seedIndonesia({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const fulfillmentModuleService = container.resolve(
    ModuleRegistrationName.FULFILLMENT
  )

  const { data: stores } = await query.graph({
    entity: "store",
    fields: ["id", "supported_currencies.*"],
  })
  const store = stores[0]
  if (!store) {
    throw new Error("No store found. Run migrations and initial seed first.")
  }

  const hasIdr = store.supported_currencies?.some(
    (c) => c?.currency_code?.toLowerCase() === "idr"
  )

  if (!hasIdr) {
    logger.info("Adding IDR to store supported currencies...")
    await updateStoresWorkflow(container).run({
      input: {
        selector: { id: store.id },
        update: {
          supported_currencies: [
            ...(store.supported_currencies ?? []).map((c) => ({
              currency_code: c!.currency_code!,
              is_default: c!.is_default ?? false,
            })),
            {
              currency_code: "idr",
              is_default: false,
            },
          ],
        },
      },
    })
    logger.info("IDR currency added.")
  } else {
    logger.info("IDR currency already configured.")
  }

  const { data: existingRegions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code", "countries.iso_2"],
  })

  let indonesiaRegion: RegionRef | undefined = existingRegions.find(
    (r) =>
      r.currency_code === "idr" ||
      r.countries?.some((c) => c?.iso_2?.toLowerCase() === "id")
  )

  if (!indonesiaRegion) {
    logger.info("Creating Indonesia region...")
    const { result } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "Indonesia",
            currency_code: "idr",
            countries: ["id"],
            payment_providers: ["pp_xendit_xendit"],
          },
        ],
      },
    })
    indonesiaRegion = result[0]
    logger.info("Indonesia region created.")
  } else {
    const { data: regionWithProviders } = await query.graph({
      entity: "region",
      fields: ["id", "payment_providers.id"],
      filters: { id: indonesiaRegion.id },
    })

    const existingIds =
      regionWithProviders[0]?.payment_providers
        ?.map((p) => p?.id)
        .filter((id): id is string => !!id) ?? []

    const withoutManual = existingIds.filter((id) => id !== "pp_system_default")
    const paymentProviders = withoutManual.includes("pp_xendit_xendit")
      ? withoutManual
      : [...withoutManual, "pp_xendit_xendit"]

    const changed =
      paymentProviders.length !== existingIds.length ||
      !existingIds.includes("pp_xendit_xendit")

    if (changed) {
      await updateRegionsWorkflow(container).run({
        input: {
          selector: { id: indonesiaRegion.id },
          update: { payment_providers: paymentProviders },
        },
      })
      logger.info("Indonesia region payment providers updated (Xendit only).")
    } else {
      logger.info("Indonesia region already exists.")
    }
  }

  const { data: taxRegions } = await query.graph({
    entity: "tax_region",
    fields: ["id", "country_code"],
  })

  if (!taxRegions.some((t) => t.country_code?.toLowerCase() === "id")) {
    logger.info("Creating tax region for Indonesia...")
    await createTaxRegionsWorkflow(container).run({
      input: [
        {
          country_code: "id",
          provider_id: "tp_system",
        },
      ],
    })
    logger.info("Tax region for Indonesia created.")
  }

  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id", "name"],
  })

  let indonesiaStockLocation: StockLocationRef | undefined = stockLocations.find((l) =>
    l.name?.toLowerCase().includes("indonesia")
  )

  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  })
  const shippingProfile = shippingProfiles[0]
  if (!shippingProfile) {
    throw new Error("No shipping profile found.")
  }

  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id"],
  })
  const salesChannel = salesChannels[0]
  if (!salesChannel) {
    throw new Error("No sales channel found.")
  }

  if (!indonesiaStockLocation) {
    logger.info("Creating Indonesia warehouse...")
    const { result } = await createStockLocationsWorkflow(container).run({
      input: {
        locations: [
          {
            name: "Indonesia Warehouse",
            address: {
              city: "Jakarta",
              country_code: "ID",
              address_1: "",
            },
          },
        ],
      },
    })
    indonesiaStockLocation = result[0]
    if (!indonesiaStockLocation) {
      throw new Error("Failed to create Indonesia stock location.")
    }

    await link.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: indonesiaStockLocation.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_provider_id: "manual_manual",
      },
    })

    await link.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: indonesiaStockLocation.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_provider_id: RAJAONGKIR_PROVIDER_ID,
      },
    })

    const indonesiaFulfillmentSet =
      await fulfillmentModuleService.createFulfillmentSets({
        name: "Indonesia Warehouse delivery",
        type: "shipping",
        service_zones: [
          {
            name: "Indonesia",
            geo_zones: [
              {
                country_code: "id",
                type: "country",
              },
            ],
          },
        ],
      })

    await link.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: indonesiaStockLocation.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_set_id: indonesiaFulfillmentSet.id,
      },
    })

    await createShippingOptionsWorkflow(container).run({
      input: RAJAONGKIR_COURIER_SHIPPING_OPTIONS.map((option) => ({
        name: option.name,
        price_type: "calculated" as const,
        provider_id: RAJAONGKIR_PROVIDER_ID,
        service_zone_id: indonesiaFulfillmentSet.service_zones[0].id,
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

    await linkSalesChannelsToStockLocationWorkflow(container).run({
      input: {
        id: indonesiaStockLocation.id,
        add: [salesChannel.id],
      },
    })

    logger.info("Indonesia warehouse and shipping configured.")
  } else {
    logger.info("Indonesia warehouse already exists.")
  }

  const { data: variants } = await query.graph({
    entity: "product_variant",
    fields: ["id", "prices.*"],
  })

  const variantsWithPrices = variants as VariantWithPrices[]
  const variantsNeedingIdr = variantsWithPrices.filter(
    (v) => !v.prices?.some((p) => p?.currency_code?.toLowerCase() === "idr")
  )

  if (variantsNeedingIdr.length) {
    logger.info(`Adding IDR prices to ${variantsNeedingIdr.length} variant(s)...`)

    const variantUpdates = variantsNeedingIdr.map((variant) => {
      const usdPrice = variant.prices?.find(
        (p) => p?.currency_code?.toLowerCase() === "usd"
      )
      const eurPrice = variant.prices?.find(
        (p) => p?.currency_code?.toLowerCase() === "eur"
      )

      const priceIdr = usdPrice
        ? Math.round(Number(usdPrice.amount) * USD_TO_IDR)
        : eurPrice
          ? Math.round(Number(eurPrice.amount) * EUR_TO_IDR)
          : 0

      return {
        id: variant.id,
        prices: [
          ...(variant.prices ?? [])
            .filter((p) => p?.currency_code)
            .map((p) => ({
              amount: Number(p!.amount),
              currency_code: p!.currency_code!,
            })),
          {
            amount: priceIdr,
            currency_code: "idr",
          },
        ],
      }
    })

    await updateProductVariantsWorkflow(container).run({
      input: {
        product_variants: variantUpdates,
      },
    })

    logger.info("IDR prices added to product variants.")
  } else {
    logger.info("All variants already have IDR prices.")
  }

  await syncVariantInventory(container)

  logger.info("Indonesia seed completed.")
}
