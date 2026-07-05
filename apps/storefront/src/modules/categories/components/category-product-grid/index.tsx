import { listProductsWithSort } from "@lib/data/products"
import {
  WoodmartProductCardData,
  mapProductToCardData,
} from "@lib/woodmart/catalog-helpers"
import { sortProducts } from "@lib/util/sort-products"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import WoodmartProductCard from "@modules/home/components/woodmart-product-card"
import { Pagination } from "@modules/store/components/pagination"

import CategoryToolbar, {
  CategorySortOption,
} from "../category-toolbar"

const DEFAULT_LIMIT = 12

function sortByRating(products: WoodmartProductCardData[]) {
  return [...products].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
}

function toBackendSort(sortBy: CategorySortOption): SortOptions {
  if (sortBy === "rating_desc") {
    return "created_at"
  }
  return sortBy
}

type CategoryProductGridProps = {
  categoryId: string
  countryCode: string
  page: number
  limit: number
  sortBy: CategorySortOption
}

export default async function CategoryProductGrid({
  categoryId,
  countryCode,
  page,
  limit,
  sortBy,
}: CategoryProductGridProps) {
  const backendSort = toBackendSort(sortBy)

  const {
    response: { products, count },
  } = await listProductsWithSort({
    page,
    queryParams: {
      limit,
      category_id: [categoryId],
    },
    sortBy: backendSort,
    countryCode,
  })

  let cards = products
    .map(mapProductToCardData)
    .filter((product): product is WoodmartProductCardData => product !== null)

  if (sortBy === "rating_desc") {
    cards = sortByRating(cards)
  } else if (sortBy === "price_asc" || sortBy === "price_desc") {
    const sorted = sortProducts(products, sortBy)
    cards = sorted
      .map(mapProductToCardData)
      .filter((product): product is WoodmartProductCardData => product !== null)
  }

  const totalPages = Math.ceil(count / limit)

  return (
    <>
      <CategoryToolbar
        totalCount={count}
        page={page}
        limit={limit}
        sortBy={sortBy}
      />

      {cards.length > 0 ? (
        <ul className="grid grid-cols-1 gap-6 xsmall:grid-cols-2 medium:grid-cols-3">
          {cards.map((product) => (
            <li key={product.id}>
              <WoodmartProductCard product={product} variant="category" />
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-16 text-center text-sm text-[#888]">
          No products found in this category.
        </p>
      )}

      {totalPages > 1 && (
        <div className="mt-10 flex justify-center">
          <Pagination page={page} totalPages={totalPages} />
        </div>
      )}
    </>
  )
}
