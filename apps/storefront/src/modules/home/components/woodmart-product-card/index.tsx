"use client"

import Image from "next/image"

import { WoodmartProductCardData } from "@lib/woodmart/catalog-helpers"
import { useWishlist } from "@lib/wishlist/wishlist-context"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-1 text-xs text-[#888]">
      <svg
        width="12"
        height="12"
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

function ProductBadge({ badge, salePercent }: { badge?: string; salePercent?: number }) {
  if (badge === "new") {
    return (
      <span className="absolute left-3 top-3 rounded-sm bg-[#27ae60] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
        New
      </span>
    )
  }

  if (badge === "hot") {
    return (
      <span className="absolute left-3 top-3 rounded-sm bg-[#e67e22] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
        Hot
      </span>
    )
  }

  if (badge === "sale" && salePercent) {
    return (
      <span className="absolute left-3 top-3 rounded-sm bg-[#e67e22] px-2 py-0.5 text-[10px] font-bold text-white">
        -{salePercent}%
      </span>
    )
  }

  return null
}

export default function WoodmartProductCard({
  product,
  variant = "default",
}: {
  product: WoodmartProductCardData
  variant?: "default" | "category"
}) {
  const isCategory = variant === "category"
  const { isWishlisted, toggleWishlist } = useWishlist()
  const wishlisted = isWishlisted(product.id)

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group block"
    >
      <article
        className={`relative flex h-full flex-col overflow-hidden bg-white transition hover:shadow-md ${
          isCategory
            ? "rounded-lg ring-1 ring-[#eee]"
            : "rounded-xl p-3 shadow-sm ring-1 ring-[#eee]"
        }`}
      >
        <div
          className={`relative overflow-hidden bg-[#f5f5f5] ${
            isCategory
              ? "aspect-[350/400]"
              : "mb-3 aspect-[350/400] rounded-lg"
          }`}
        >
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-cover transition duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#ebebeb] px-2 text-center text-xs text-[#999]">
              {product.title}
            </div>
          )}

          <ProductBadge badge={product.badge} salePercent={product.salePercent} />

          <button
            type="button"
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={wishlisted}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleWishlist(product)
            }}
            className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-sm transition ${
              wishlisted
                ? "text-[#e74c3c]"
                : "text-[#999] hover:text-[#e74c3c]"
            }`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={wishlisted ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        <div className={`flex flex-1 flex-col ${isCategory ? "p-4 pt-3" : ""}`}>
          {isCategory ? (
            <>
              <div className="mb-1 flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-[#2d2d2d] group-hover:text-[#111]">
                  {product.title}
                </h3>
                {product.rating != null ? (
                  <StarRating rating={product.rating} />
                ) : null}
              </div>
              {product.categoryLabel ? (
                <p className="mb-3 text-xs text-[#999]">{product.categoryLabel}</p>
              ) : null}
            </>
          ) : (
            <>
              <h3 className="mb-1 text-sm font-semibold text-[#2d2d2d] group-hover:text-[#111]">
                {product.title}
              </h3>
              {product.categoryLabel ? (
                <p className="mb-2 text-xs text-[#999]">{product.categoryLabel}</p>
              ) : null}
            </>
          )}

          <div className="mt-auto flex flex-wrap items-center gap-2">
            <span className="text-base font-semibold text-[#e67e22]">
              {product.price}
            </span>
            {product.originalPrice ? (
              <span className="text-sm text-[#bbb] line-through">
                {product.originalPrice}
              </span>
            ) : null}
          </div>

          {product.swatches && product.swatches.length > 0 ? (
            <div className="mt-3 flex gap-1.5">
              {product.swatches.map((color) => (
                <span
                  key={color}
                  className="h-4 w-4 rounded-full border border-[#ddd]"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          ) : null}
        </div>
      </article>
    </LocalizedClientLink>
  )
}
