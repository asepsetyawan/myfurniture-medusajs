"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

export type CategorySortOption =
  | "created_at"
  | "price_asc"
  | "price_desc"
  | "rating_desc"

const SORT_OPTIONS: { value: CategorySortOption; label: string }[] = [
  { value: "rating_desc", label: "Sort by average rating" },
  { value: "created_at", label: "Sort by latest" },
  { value: "price_asc", label: "Sort by price: low to high" },
  { value: "price_desc", label: "Sort by price: high to low" },
]

const PAGE_SIZES = [9, 12, 18, 24] as const

type CategoryToolbarProps = {
  totalCount: number
  page: number
  limit: number
  sortBy: CategorySortOption
}

export default function CategoryToolbar({
  totalCount,
  page,
  limit,
  sortBy,
}: CategoryToolbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const start = totalCount === 0 ? 0 : (page - 1) * limit + 1
  const end = Math.min(page * limit, totalCount)

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      params.set(key, value)
    })
    if (!updates.page) {
      params.set("page", "1")
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-[#eee] pb-4 small:flex-row small:items-center small:justify-between">
      <p className="text-sm text-[#666]">
        {totalCount > 0 ? (
          <>
            Showing {start}–{end} of {totalCount} results
          </>
        ) : (
          "No results"
        )}
      </p>

      <div className="flex flex-wrap items-center gap-4 text-sm text-[#555]">
        <div className="flex items-center gap-2">
          <span className="text-[#888]">Show:</span>
          {PAGE_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => updateParams({ limit: String(size) })}
              className={
                limit === size
                  ? "font-semibold text-[#2d2d2d]"
                  : "text-[#999] transition hover:text-[#333]"
              }
            >
              {size}
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-1 small:flex">
          <button
            type="button"
            aria-label="List view"
            className="flex h-8 w-8 items-center justify-center rounded text-[#bbb] hover:bg-[#f5f5f5] hover:text-[#333]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <rect x="3" y="5" width="18" height="2" rx="1" />
              <rect x="3" y="11" width="18" height="2" rx="1" />
              <rect x="3" y="17" width="18" height="2" rx="1" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Grid view"
            className="flex h-8 w-8 items-center justify-center rounded bg-[#f0f0f0] text-[#333]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </button>
        </div>

        <select
          value={sortBy}
          onChange={(e) =>
            updateParams({ sortBy: e.target.value as CategorySortOption })
          }
          className="cursor-pointer rounded-md border border-[#e5e5e5] bg-white py-1.5 pl-3 pr-8 text-sm text-[#333] outline-none focus:border-[#ccc]"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
