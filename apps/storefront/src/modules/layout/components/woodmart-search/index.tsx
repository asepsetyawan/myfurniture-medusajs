"use client"

import Image from "next/image"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import { searchProductSuggestions } from "@lib/client/search-products"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type WoodmartSearchProps = {
  regions: HttpTypes.StoreRegion[]
}

export default function WoodmartSearch({ regions }: WoodmartSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { countryCode } = useParams() as { countryCode: string }
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<HttpTypes.StoreProduct[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const regionId = useMemo(() => {
    const region = regions.find((r) =>
      r.countries?.some((c) => c.iso_2 === countryCode)
    )
    return region?.id
  }, [regions, countryCode])

  useEffect(() => {
    const q = searchParams.get("q")
    if (q != null) {
      setQuery(q)
    }
  }, [searchParams])

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", onPointerDown)
    return () => document.removeEventListener("mousedown", onPointerDown)
  }, [])

  useEffect(() => {
    const trimmed = query.trim()
    if (!trimmed || trimmed.length < 2 || !regionId) {
      setSuggestions([])
      setLoading(false)
      return
    }

    const timer = window.setTimeout(async () => {
      setLoading(true)
      try {
        const products = await searchProductSuggestions({
          q: trimmed,
          regionId,
          limit: 6,
        })
        setSuggestions(products)
        setOpen(true)
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => window.clearTimeout(timer)
  }, [query, regionId])

  const goToSearch = useCallback(
    (term: string) => {
      const q = term.trim()
      const base = `/${countryCode}/store`
      router.push(q ? `${base}?q=${encodeURIComponent(q)}` : base)
      setOpen(false)
    },
    [countryCode, router]
  )

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    goToSearch(query)
  }

  return (
    <div ref={containerRef} className="relative w-full min-w-0">
      <form onSubmit={onSubmit} className="w-full min-w-0">
        <div className="relative">
          <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#999]">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              aria-hidden
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) {
                setOpen(true)
              }
            }}
            placeholder="Search for products"
            autoComplete="off"
            className="w-full rounded-full border border-[#e0e0e0] bg-white py-3 pl-12 pr-5 text-sm text-[#333] outline-none transition placeholder:text-[#aaa] focus:border-[#ccc] focus:ring-1 focus:ring-[#e0e0e0]"
          />
        </div>
      </form>

      {open && query.trim().length >= 2 ? (
        <div
          className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-xl border border-[#e8e8e8] bg-white shadow-lg"
          role="listbox"
        >
          {loading ? (
            <p className="px-4 py-3 text-sm text-[#888]">Mencari…</p>
          ) : suggestions.length > 0 ? (
            <ul>
              {suggestions.map((product) => (
                <li key={product.id}>
                  <LocalizedClientLink
                    href={`/products/${product.handle}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#333] transition hover:bg-[#fafafa]"
                  >
                    <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-[#f0f0f0]">
                      {product.thumbnail ? (
                        <Image
                          src={product.thumbnail}
                          alt={product.title ?? ""}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      ) : null}
                    </span>
                    <span className="line-clamp-2">{product.title}</span>
                  </LocalizedClientLink>
                </li>
              ))}
              <li className="border-t border-[#eee]">
                <button
                  type="button"
                  onClick={() => goToSearch(query)}
                  className="w-full px-4 py-2.5 text-left text-sm font-medium text-[#e67e22] hover:bg-[#fafafa]"
                >
                  Lihat semua hasil untuk “{query.trim()}”
                </button>
              </li>
            </ul>
          ) : (
            <p className="px-4 py-3 text-sm text-[#888]">Produk tidak ditemukan</p>
          )}
        </div>
      ) : null}
    </div>
  )
}
