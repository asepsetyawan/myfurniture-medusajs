"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

export function Pagination({
  page,
  totalPages,
  "data-testid": dataTestid,
}: {
  page: number
  totalPages: number
  "data-testid"?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const arrayRange = (start: number, stop: number) =>
    Array.from({ length: stop - start + 1 }, (_, index) => start + index)

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", newPage.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  const renderPageButton = (
    p: number,
    label: string | number,
    isCurrent: boolean
  ) => (
    <button
      key={p}
      type="button"
      className={`flex h-9 min-w-9 items-center justify-center rounded-md text-sm font-medium transition ${
        isCurrent
          ? "bg-[#2d2d2d] text-white"
          : "text-[#666] hover:bg-[#f0f0f0] hover:text-[#2d2d2d]"
      }`}
      disabled={isCurrent}
      onClick={() => handlePageChange(p)}
    >
      {label}
    </button>
  )

  const renderEllipsis = (key: string) => (
    <span key={key} className="px-1 text-sm text-[#bbb]">
      …
    </span>
  )

  const renderPageButtons = () => {
    const buttons = []

    if (totalPages <= 7) {
      buttons.push(
        ...arrayRange(1, totalPages).map((p) =>
          renderPageButton(p, p, p === page)
        )
      )
    } else if (page <= 4) {
      buttons.push(
        ...arrayRange(1, 5).map((p) => renderPageButton(p, p, p === page))
      )
      buttons.push(renderEllipsis("ellipsis1"))
      buttons.push(
        renderPageButton(totalPages, totalPages, totalPages === page)
      )
    } else if (page >= totalPages - 3) {
      buttons.push(renderPageButton(1, 1, 1 === page))
      buttons.push(renderEllipsis("ellipsis2"))
      buttons.push(
        ...arrayRange(totalPages - 4, totalPages).map((p) =>
          renderPageButton(p, p, p === page)
        )
      )
    } else {
      buttons.push(renderPageButton(1, 1, 1 === page))
      buttons.push(renderEllipsis("ellipsis3"))
      buttons.push(
        ...arrayRange(page - 1, page + 1).map((p) =>
          renderPageButton(p, p, p === page)
        )
      )
      buttons.push(renderEllipsis("ellipsis4"))
      buttons.push(
        renderPageButton(totalPages, totalPages, totalPages === page)
      )
    }

    return buttons
  }

  return (
    <nav
      className="flex justify-center"
      aria-label="Pagination"
      data-testid={dataTestid}
    >
      <div className="flex items-center gap-1">{renderPageButtons()}</div>
    </nav>
  )
}
