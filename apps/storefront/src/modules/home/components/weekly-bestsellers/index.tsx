import { listProducts } from "@lib/data/products"
import {
  WoodmartProductCardData,
  buildBestsellerTabs,
  mapProductToCardData,
} from "@lib/woodmart/catalog-helpers"
import { HttpTypes } from "@medusajs/types"

import WeeklyBestsellersClient from "./client"

export default async function WeeklyBestsellers({
  countryCode,
  categories,
}: {
  countryCode: string
  categories: HttpTypes.StoreProductCategory[]
}) {
  const { response } = await listProducts({
    countryCode,
    queryParams: {
      limit: 24,
      order: "-created_at",
      fields: "*variants.calculated_price,*categories",
    },
  })

  const products = response.products
    .map(mapProductToCardData)
    .filter((product): product is WoodmartProductCardData => product !== null)

  const tabs = buildBestsellerTabs(categories)

  return <WeeklyBestsellersClient products={products} tabs={tabs} />
}
