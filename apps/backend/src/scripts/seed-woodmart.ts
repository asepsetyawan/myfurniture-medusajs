import { MedusaContainer } from "@medusajs/framework"
import {
  ContainerRegistrationKeys,
  ProductStatus,
} from "@medusajs/framework/utils"
import { createProductsWorkflow } from "@medusajs/medusa/core-flows"

import { WOODMART_PRODUCTS, resolveImageUrl } from "./data/woodmart-catalog"
import { replaceFurnitureCategories } from "./lib/replace-furniture-categories"
import { syncVariantInventory } from "./lib/sync-variant-inventory"

const USD_TO_EUR = 0.92
const USD_TO_IDR = 16000

export default async function seedWoodmart({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const storefrontBaseUrl =
    process.env.STOREFRONT_URL ||
    process.env.STORE_FRONT_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:8000"

  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  })
  const shippingProfile = shippingProfiles[0]
  if (!shippingProfile) {
    throw new Error(
      "No shipping profile found. Run migrations and initial seed first."
    )
  }

  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id"],
  })
  const salesChannel = salesChannels[0]
  if (!salesChannel) {
    throw new Error(
      "No sales channel found. Run migrations and initial seed first."
    )
  }

  const categories = await replaceFurnitureCategories(container, {
    storefrontBaseUrl,
    deleteProducts: true,
  })

  const categoryByHandle = new Map(
    categories.map((category) => [category.handle, category])
  )

  logger.info("Creating myfurniture products...")
  await createProductsWorkflow(container).run({
    input: {
      products: WOODMART_PRODUCTS.map((product) => {
        const category = categoryByHandle.get(product.categoryHandle)
        if (!category) {
          throw new Error(`Unknown category handle: ${product.categoryHandle}`)
        }

        const imageUrl = resolveImageUrl(product.imagePath, storefrontBaseUrl)
        const priceEur = Math.round(product.priceUsd * USD_TO_EUR * 100) / 100
        const priceIdr = Math.round(product.priceUsd * USD_TO_IDR)
        const sku = `WM-${product.handle.toUpperCase().replace(/-/g, "_")}`

        return {
          title: product.title,
          handle: product.handle,
          description: product.description,
          category_ids: [category.id],
          weight: product.weight ?? 5000,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: imageUrl }],
          options: [
            {
              title: "Default",
              values: ["Default"],
            },
          ],
          variants: [
            {
              title: "Default",
              sku,
              options: { Default: "Default" },
              prices: [
                {
                  amount: priceEur,
                  currency_code: "eur",
                },
                {
                  amount: product.priceUsd,
                  currency_code: "usd",
                },
                {
                  amount: priceIdr,
                  currency_code: "idr",
                },
              ],
            },
          ],
          sales_channels: [{ id: salesChannel.id }],
        }
      }),
    },
  })

  logger.info(`Created ${WOODMART_PRODUCTS.length} products.`)

  await syncVariantInventory(container)

  logger.info("myfurniture seed completed.")
}
