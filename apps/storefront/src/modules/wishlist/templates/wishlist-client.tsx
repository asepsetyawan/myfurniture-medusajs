"use client"

import Image from "next/image"
import { useMemo } from "react"

import { useWishlist } from "@lib/wishlist/wishlist-context"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function WishlistPageClient() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist()

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => a.title.localeCompare(b.title)),
    [items]
  )

  return (
    <div className="content-container py-10 small:py-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1a1a1a]">Wishlist</h1>
          <p className="mt-1 text-sm text-[#777]">
            Disimpan di perangkat Anda ({items.length} produk)
          </p>
        </div>
        {items.length > 0 ? (
          <button
            type="button"
            onClick={clearWishlist}
            className="text-sm text-[#999] underline-offset-2 transition hover:text-[#e74c3c] hover:underline"
          >
            Hapus semua
          </button>
        ) : null}
      </div>

      {sortedItems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#e0e0e0] bg-[#fafafa] px-6 py-16 text-center">
          <p className="mb-4 text-[#666]">Belum ada produk di wishlist Anda.</p>
          <LocalizedClientLink
            href="/store"
            className="inline-flex rounded-full bg-[#1a1a1a] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#333]"
          >
            Jelajahi produk
          </LocalizedClientLink>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 small:grid-cols-2 medium:grid-cols-3 large:grid-cols-4">
          {sortedItems.map((item) => (
            <li
              key={item.id}
              className="flex gap-4 rounded-xl border border-[#eee] bg-white p-4 shadow-sm"
            >
              <LocalizedClientLink
                href={`/products/${item.handle}`}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-[#f5f5f5]"
              >
                {item.thumbnail ? (
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center px-2 text-center text-xs text-[#999]">
                    {item.title}
                  </span>
                )}
              </LocalizedClientLink>

              <div className="flex min-w-0 flex-1 flex-col">
                <LocalizedClientLink
                  href={`/products/${item.handle}`}
                  className="line-clamp-2 text-sm font-semibold text-[#2d2d2d] hover:text-[#111]"
                >
                  {item.title}
                </LocalizedClientLink>
                <div className="mt-auto flex flex-wrap gap-3 pt-3">
                  <LocalizedClientLink
                    href={`/products/${item.handle}`}
                    className="text-xs font-medium text-[#e67e22] hover:underline"
                  >
                    Lihat produk
                  </LocalizedClientLink>
                  <button
                    type="button"
                    onClick={() => removeFromWishlist(item.id)}
                    className="text-xs text-[#999] hover:text-[#e74c3c]"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
