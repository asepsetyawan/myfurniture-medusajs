import { Suspense } from "react"

import CategorySidebar from "@modules/categories/components/category-sidebar"
import { CategorySortOption } from "@modules/categories/components/category-toolbar"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import StoreHero from "@modules/store/components/store-hero"
import StoreProductGrid from "@modules/store/components/store-product-grid"

const DEFAULT_LIMIT = 12

const StoreTemplate = ({
  sortBy,
  page,
  limit,
  q,
  countryCode,
}: {
  sortBy?: CategorySortOption
  page?: string
  limit?: string
  q?: string
  countryCode: string
}) => {
  const pageNumber = page ? Math.max(parseInt(page, 10), 1) : 1
  const pageLimit = limit ? parseInt(limit, 10) : DEFAULT_LIMIT
  const sort = sortBy ?? "created_at"
  const searchQuery = q?.trim() || undefined

  const title = searchQuery
    ? `Search: “${searchQuery}”`
    : "All products"

  const subtitle = searchQuery
    ? "Find furniture that matches your style"
    : "Browse our full collection of furniture and decor"

  return (
    <div data-testid="category-container">
      <StoreHero title={title} subtitle={subtitle} />

      <div className="bg-[#f7f4f0] py-8 small:py-10">
        <div className="content-container">
          <div className="flex flex-col gap-8 small:flex-row small:items-start small:gap-10">
            <CategorySidebar />

            <div className="min-w-0 flex-1">
              <Suspense
                key={`store-${pageNumber}-${pageLimit}-${sort}-${searchQuery ?? ""}`}
                fallback={
                  <div>
                    <div className="mb-6 h-10 animate-pulse rounded bg-[#f0f0f0]" />
                    <SkeletonProductGrid numberOfProducts={pageLimit} />
                  </div>
                }
              >
                <StoreProductGrid
                  countryCode={countryCode}
                  page={pageNumber}
                  limit={pageLimit}
                  sortBy={sort}
                  q={searchQuery}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StoreTemplate
