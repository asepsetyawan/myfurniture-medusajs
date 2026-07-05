import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="mb-6 block h-9 w-32 animate-pulse rounded bg-[#f0f0f0]" />
  }

  return (
    <div className="mb-6 flex flex-wrap items-baseline gap-3">
      <span
        className="text-2xl font-semibold text-[#e67e22]"
        data-testid="product-price"
        data-value={selectedPrice.calculated_price_number}
      >
        {!variant && "From "}
        {selectedPrice.calculated_price}
      </span>
      {selectedPrice.price_type === "sale" ? (
        <>
          <span
            className="text-lg text-[#bbb] line-through"
            data-testid="original-product-price"
            data-value={selectedPrice.original_price_number}
          >
            {selectedPrice.original_price}
          </span>
          <span className="rounded-sm bg-[#e67e22]/10 px-2 py-0.5 text-sm font-semibold text-[#e67e22]">
            -{selectedPrice.percentage_diff}%
          </span>
        </>
      ) : null}
    </div>
  )
}
