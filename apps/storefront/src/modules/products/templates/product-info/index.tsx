import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getCategoryHref, getPrimaryCategory } from "@lib/woodmart/catalog-helpers"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
  rating?: number
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-1.5 text-sm text-[#888]">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="#f5a623"
        aria-hidden
      >
        <path d="M12 2l2.9 6.9 7.1.6-5.4 4.6 1.7 7-6.3-3.8-6.3 3.8 1.7-7-5.4-4.6 7.1-.6L12 2z" />
      </svg>
      <span className="font-medium text-[#666]">{rating.toFixed(1)}</span>
    </span>
  )
}

const ProductInfo = ({ product, rating }: ProductInfoProps) => {
  const primaryCategory = getPrimaryCategory(product)

  return (
    <div id="product-info" className="mb-6">
      {primaryCategory?.handle ? (
        <LocalizedClientLink
          href={getCategoryHref(primaryCategory.handle)}
          className="mb-2 inline-block text-xs font-medium uppercase tracking-wider text-[#e67e22] hover:underline"
        >
          {primaryCategory.name}
        </LocalizedClientLink>
      ) : product.collection ? (
        <LocalizedClientLink
          href={`/collections/${product.collection.handle}`}
          className="mb-2 inline-block text-xs font-medium uppercase tracking-wider text-[#e67e22] hover:underline"
        >
          {product.collection.title}
        </LocalizedClientLink>
      ) : null}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1
          className="font-display text-2xl font-semibold leading-tight text-[#2d2d2d] small:text-3xl"
          data-testid="product-title"
        >
          {product.title}
        </h1>
        {rating != null ? <StarRating rating={rating} /> : null}
      </div>

      {product.description ? (
        <p
          className="mt-4 text-sm leading-relaxed text-[#6b6b6b]"
          data-testid="product-description"
        >
          {product.description}
        </p>
      ) : null}
    </div>
  )
}

export default ProductInfo
