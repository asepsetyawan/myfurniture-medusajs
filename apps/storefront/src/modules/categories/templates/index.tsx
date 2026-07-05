import { notFound } from "next/navigation"
import { Suspense } from "react"

import { HttpTypes } from "@medusajs/types"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"

import CategoryHero from "../components/category-hero"
import CategoryProductGrid from "../components/category-product-grid"
import CategorySidebar from "../components/category-sidebar"
import { CategorySortOption } from "../components/category-toolbar"

const DEFAULT_LIMIT = 12

export default function CategoryTemplate({
  category,
  sortBy,
  page,
  limit,
  countryCode,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: CategorySortOption
  page?: string
  limit?: string
  countryCode: string
}) {
  const pageNumber = page ? Math.max(parseInt(page, 10), 1) : 1
  const pageLimit = limit ? parseInt(limit, 10) : DEFAULT_LIMIT
  const sort = sortBy ?? "rating_desc"

  if (!category?.id || !countryCode) {
    notFound()
  }

  return (
    <div data-testid="category-container">
      <CategoryHero category={category} />

      <div className="content-container py-8 small:py-10">
        <div className="flex flex-col gap-8 small:flex-row small:items-start small:gap-10">
          <CategorySidebar />

          <div className="min-w-0 flex-1">
            <Suspense
              key={`${category.id}-${pageNumber}-${pageLimit}-${sort}`}
              fallback={
                <div>
                  <div className="mb-6 h-10 animate-pulse rounded bg-[#f0f0f0]" />
                  <SkeletonProductGrid numberOfProducts={pageLimit} />
                </div>
              }
            >
              <CategoryProductGrid
                categoryId={category.id}
                countryCode={countryCode}
                page={pageNumber}
                limit={pageLimit}
                sortBy={sort}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
