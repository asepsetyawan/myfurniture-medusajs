import { listProductsWithSort } from "@lib/data/products"
import {
  WoodmartProductCardData,
  mapProductToCardData,
} from "@lib/woodmart/catalog-helpers"
import { sortProducts } from "@lib/util/sort-products"
import WoodmartProductCard from "@modules/home/components/woodmart-product-card"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import CategoryToolbar, {
  CategorySortOption,
} from "@modules/categories/components/category-toolbar"

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

type StoreProductGridProps = {
  countryCode: string
  page: number
  limit: number
  sortBy: CategorySortOption
  q?: string
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
}

export default async function StoreProductGrid({
  countryCode,
  page,
  limit,
  sortBy,
  q,
  collectionId,
  categoryId,
  productsIds,
}: StoreProductGridProps) {
  const backendSort = toBackendSort(sortBy)

  const queryParams: {
    limit: number
    collection_id?: string[]
    category_id?: string[]
    id?: string[]
    q?: string
  } = { limit }

  if (collectionId) {
    queryParams.collection_id = [collectionId]
  }
  if (categoryId) {
    queryParams.category_id = [categoryId]
  }
  if (productsIds) {
    queryParams.id = productsIds
  }
  if (q) {
    queryParams.q = q
  }

  const {
    response: { products, count },
  } = await listProductsWithSort({
    page,
    queryParams,
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
          {q
            ? `No products match “${q}”. Try a different search term.`
            : "No products found."}
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
