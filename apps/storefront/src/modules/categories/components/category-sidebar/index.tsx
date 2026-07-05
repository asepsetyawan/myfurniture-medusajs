"use client"

import Image from "next/image"
import { useState } from "react"

import { formatRupiah } from "@lib/util/money"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const BRANDS = [
  { name: "HAY", count: 1 },
  { name: "Poliform", count: 1 },
  { name: "Vitra", count: 1 },
]

const COLORS = [
  { name: "American Silver", hex: "#c9c9c9", count: 1 },
  { name: "Bone", hex: "#e8e0d5", count: 1 },
  { name: "Dark Gray", hex: "#4a4a4a", count: 1 },
  { name: "Light Gray", hex: "#d3d3d3", count: 1 },
]

const MATERIALS = [
  { name: "Fabric", count: 12 },
  { name: "Leather", count: 2 },
  { name: "Metal", count: 4 },
  { name: "Plastic", count: 3 },
  { name: "Rattan", count: 1 },
  { name: "Wood", count: 5 },
]

function FilterSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="border-b border-[#eee] py-5 last:border-0">
      <h3 className="mb-4 text-sm font-semibold text-[#2d2d2d]">{title}</h3>
      {children}
    </div>
  )
}

function FilterSearch({ placeholder }: { placeholder: string }) {
  return (
    <div className="relative mb-3">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#999]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
          <path d="m18 18-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </span>
      <input
        type="search"
        placeholder={placeholder}
        className="w-full rounded-md border border-[#e5e5e5] bg-white py-2 pl-9 pr-3 text-xs text-[#333] outline-none focus:border-[#ccc]"
      />
    </div>
  )
}

export default function CategorySidebar() {
  const [priceMin] = useState(4_000_000)
  const [priceMax, setPriceMax] = useState(9_500_000)

  return (
    <aside className="w-full shrink-0 small:w-[260px] medium:w-[280px]">
      <div className="rounded-lg border border-[#eee] bg-white px-5 py-2">
        <FilterSection title="Filter By Price">
          <div className="mb-4 px-1">
            <input
              type="range"
              min={0}
              max={100_000_000}
              step={500_000}
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="h-1 w-full cursor-pointer appearance-none rounded-full bg-[#f0f0f0] accent-[#e67e22]"
            />
          </div>
          <p className="mb-3 text-xs text-[#666]">
            Price: {formatRupiah(priceMin)} — {formatRupiah(priceMax)}
          </p>
          <button
            type="button"
            className="rounded-md bg-[#f5f5f5] px-4 py-2 text-xs font-medium text-[#333] transition hover:bg-[#ebebeb]"
          >
            Filter
          </button>
        </FilterSection>

        <FilterSection title="Filter By Brand">
          <FilterSearch placeholder="Find a Brand" />
          <ul className="space-y-2.5">
            {BRANDS.map((brand) => (
              <li key={brand.name}>
                <label className="flex cursor-pointer items-center gap-2 text-xs text-[#444]">
                  <input type="checkbox" className="rounded border-[#ccc]" />
                  <span className="flex-1">{brand.name}</span>
                  <span className="text-[#aaa]">({brand.count})</span>
                </label>
              </li>
            ))}
          </ul>
        </FilterSection>

        <FilterSection title="Color">
          <FilterSearch placeholder="Find a Color" />
          <ul className="max-h-40 space-y-2.5 overflow-y-auto pr-1">
            {COLORS.map((color) => (
              <li key={color.name}>
                <label className="flex cursor-pointer items-center gap-2 text-xs text-[#444]">
                  <input type="checkbox" className="rounded border-[#ccc]" />
                  <span
                    className="h-4 w-4 shrink-0 rounded-full border border-[#ddd]"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="flex-1">{color.name}</span>
                  <span className="text-[#aaa]">({color.count})</span>
                </label>
              </li>
            ))}
          </ul>
        </FilterSection>

        <FilterSection title="Materials">
          <ul className="space-y-2.5">
            {MATERIALS.map((material) => (
              <li key={material.name}>
                <label className="flex cursor-pointer items-center gap-2 text-xs text-[#444]">
                  <input type="checkbox" className="rounded border-[#ccc]" />
                  <span className="flex-1">{material.name}</span>
                  <span className="text-[#aaa]">({material.count})</span>
                </label>
              </li>
            ))}
          </ul>
        </FilterSection>

        <FilterSection title="Product Status">
          <ul className="space-y-2.5">
            {[
              { name: "On sale", count: 3 },
              { name: "In stock", count: 14 },
              { name: "On backorder", count: 0 },
            ].map((status) => (
              <li key={status.name}>
                <label className="flex cursor-pointer items-center gap-2 text-xs text-[#444]">
                  <input type="checkbox" className="rounded border-[#ccc]" />
                  <span className="flex-1">{status.name}</span>
                  <span className="text-[#aaa]">({status.count})</span>
                </label>
              </li>
            ))}
          </ul>
        </FilterSection>
      </div>

      <div className="relative mt-6 overflow-hidden rounded-lg">
        <div className="relative aspect-[4/5] w-full">
          <Image
            src="/images/woodmart/products/belt.jpg"
            alt="Upholstered chair"
            fill
            className="object-cover"
            sizes="280px"
          />
          <div className="absolute inset-0 bg-[#2a9d8f]/85 p-6 flex flex-col justify-end text-white">
            <p className="text-lg font-semibold leading-tight">Upholstered chair</p>
            <p className="mt-1 text-sm text-white/90">Discount 10%</p>
            <LocalizedClientLink
              href="/store"
              className="mt-4 inline-flex w-fit rounded-full bg-white px-5 py-2 text-xs font-semibold text-[#2a9d8f] transition hover:bg-white/90"
            >
              Shop Now
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </aside>
  )
}
