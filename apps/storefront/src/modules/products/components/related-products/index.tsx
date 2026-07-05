import { listProducts } from "@lib/data/products"
import {
  WoodmartProductCardData,
  mapProductToCardData,
} from "@lib/woodmart/catalog-helpers"
import { HttpTypes } from "@medusajs/types"
import WoodmartProductCard from "@modules/home/components/woodmart-product-card"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const queryParams: HttpTypes.StoreProductListParams = {
    is_giftcard: false,
  }

  if (product.collection_id) {
    queryParams.collection_id = [product.collection_id]
  }
  if (product.tags) {
    queryParams.tag_id = product.tags
      .map((t) => t.id)
      .filter(Boolean) as string[]
  }

  const products = await listProducts({
    queryParams,
    countryCode,
  }).then(({ response }) => {
    return response.products.filter(
      (responseProduct) => responseProduct.id !== product.id
    )
  })

  const cards = products
    .map(mapProductToCardData)
    .filter((p): p is WoodmartProductCardData => p !== null)
    .slice(0, 4)

  if (!cards.length) {
    return null
  }

  return (
    <ul className="grid grid-cols-1 gap-6 xsmall:grid-cols-2 medium:grid-cols-4">
      {cards.map((card) => (
        <li key={card.id}>
          <WoodmartProductCard product={card} variant="category" />
        </li>
      ))}
    </ul>
  )
}
