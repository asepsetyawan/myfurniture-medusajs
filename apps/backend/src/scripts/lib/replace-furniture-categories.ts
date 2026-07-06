import { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import {
  createProductCategoriesWorkflow,
  deleteProductCategoriesWorkflow,
  deleteProductsWorkflow,
} from "@medusajs/medusa/core-flows"

import {
  WOODMART_CATEGORIES,
  resolveImageUrl,
} from "../data/woodmart-catalog"

type ReplaceFurnitureCategoriesOptions = {
  storefrontBaseUrl?: string
  deleteProducts?: boolean
}

export async function replaceFurnitureCategories(
  container: MedusaContainer,
  options: ReplaceFurnitureCategoriesOptions = {}
) {
  const { deleteProducts = true } = options
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const storefrontBaseUrl =
    options.storefrontBaseUrl ||
    process.env.STOREFRONT_URL ||
    process.env.STORE_FRONT_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:8000"

  if (deleteProducts) {
    const { data: existingProducts } = await query.graph({
      entity: "product",
      fields: ["id"],
    })

    if (existingProducts.length) {
      logger.info(`Removing ${existingProducts.length} existing product(s)...`)
      await deleteProductsWorkflow(container).run({
        input: { ids: existingProducts.map((p) => p.id) },
      })
    }
  }

  const { data: existingCategories } = await query.graph({
    entity: "product_category",
    fields: ["id"],
  })

  if (existingCategories.length) {
    logger.info(
      `Removing ${existingCategories.length} existing categor(ies)...`
    )
    await deleteProductCategoriesWorkflow(container).run({
      input: existingCategories.map((c) => c.id),
    })
  }

  logger.info("Creating furniture categories...")
  const { result: categories } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: WOODMART_CATEGORIES.map((category, index) => ({
        name: category.name,
        handle: category.handle,
        description: category.description,
        is_active: true,
        rank: index,
        metadata: {
          image: resolveImageUrl(category.imagePath, storefrontBaseUrl),
          icon: category.icon,
        },
      })),
    },
  })

  logger.info(`Created ${categories.length} furniture categories.`)
  return categories
}
