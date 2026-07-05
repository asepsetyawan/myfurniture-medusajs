import { listProducts } from "@lib/data/products"
import {
  WoodmartProductCardData,
  mapProductToCardData,
} from "@lib/woodmart/catalog-helpers"
import InteractiveLink from "@modules/common/components/interactive-link"
import WoodmartProductCard from "@modules/home/components/woodmart-product-card"

export default async function ProductCollectionsSection({
  countryCode,
}: {
  countryCode: string
}) {
  const { response } = await listProducts({
    countryCode,
    queryParams: {
      limit: 16,
      order: "-created_at",
      fields: "*variants.calculated_price,*categories",
    },
  })

  const products = response.products
    .map(mapProductToCardData)
    .filter((product): product is WoodmartProductCardData => product !== null)

  if (!products.length) {
    return null
  }

  return (
    <section className="bg-white py-14 small:py-16">
      <div className="content-container">
        <div className="mb-8 flex flex-col gap-3 small:flex-row small:items-end small:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-[#2d2d2d] small:text-3xl">
              Product collections
            </h2>
            <p className="mt-1 text-sm text-[#6b6b6b]">
              Explore product collections from our catalog
            </p>
          </div>
          <InteractiveLink href="/store">View all</InteractiveLink>
        </div>

        <div className="grid grid-cols-2 gap-4 small:grid-cols-3 medium:grid-cols-4 large:grid-cols-5 small:gap-5">
          {products.map((product) => (
            <WoodmartProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
