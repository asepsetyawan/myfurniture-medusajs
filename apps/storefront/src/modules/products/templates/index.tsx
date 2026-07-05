import React, { Suspense } from "react"
import { notFound } from "next/navigation"

import { getCategoryHref, getPrimaryCategory } from "@lib/woodmart/catalog-helpers"
import { ProductReview } from "@lib/data/reviews"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"

import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
  reviews?: ProductReview[]
  reviewCount?: number
  averageRating?: number
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
  reviews = [],
  reviewCount = 0,
  averageRating = 0,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  const primaryCategory = getPrimaryCategory(product)
  const rating = averageRating > 0 ? averageRating : undefined

  return (
    <div className="bg-[#f7f4f0]" data-testid="product-container">
      <div className="content-container py-4">
        <nav className="flex flex-wrap items-center gap-2 text-xs text-[#888]">
          <LocalizedClientLink href="/" className="transition hover:text-[#2d2d2d]">
            Home
          </LocalizedClientLink>
          <span aria-hidden>/</span>
          <LocalizedClientLink
            href="/store"
            className="transition hover:text-[#2d2d2d]"
          >
            Shop
          </LocalizedClientLink>
          {primaryCategory?.handle ? (
            <>
              <span aria-hidden>/</span>
              <LocalizedClientLink
                href={getCategoryHref(primaryCategory.handle)}
                className="transition hover:text-[#2d2d2d]"
              >
                {primaryCategory.name}
              </LocalizedClientLink>
            </>
          ) : null}
          <span aria-hidden>/</span>
          <span className="text-[#2d2d2d]">{product.title}</span>
        </nav>
      </div>

      <div className="content-container pb-10 small:pb-14">
        <div className="grid grid-cols-1 gap-8 medium:grid-cols-2 medium:gap-12">
          <ImageGallery images={images} productTitle={product.title ?? ""} />

          <div className="flex flex-col gap-4">
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-[#eee] small:p-8">
              <ProductInfo product={product} rating={rating} />

              <Suspense
                fallback={
                  <ProductActions
                    disabled
                    product={product}
                    region={region}
                  />
                }
              >
                <ProductActionsWrapper id={product.id} region={region} />
              </Suspense>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-[#eee] small:p-8">
              <ProductTabs
                product={product}
                reviews={reviews}
                reviewCount={reviewCount}
                averageRating={averageRating}
              />
            </div>
          </div>
        </div>
      </div>

      <section
        className="bg-white py-14 small:py-20"
        data-testid="related-products-container"
      >
        <div className="content-container">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl font-semibold text-[#2d2d2d] small:text-4xl">
              Related products
            </h2>
            <p className="mt-2 text-base text-[#6b6b6b]">
              You might also like these pieces
            </p>
          </div>
          <Suspense fallback={<SkeletonRelatedProducts />}>
            <RelatedProducts product={product} countryCode={countryCode} />
          </Suspense>
        </div>
      </section>
    </div>
  )
}

export default ProductTemplate
