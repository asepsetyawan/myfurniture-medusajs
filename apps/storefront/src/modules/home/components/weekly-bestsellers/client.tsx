"use client"

import { useMemo, useState } from "react"

import { WoodmartProductCardData } from "@lib/woodmart/catalog-helpers"
import WoodmartProductCard from "@modules/home/components/woodmart-product-card"

const WEEKLY_BESTSELLERS_LIMIT = 8

export default function WeeklyBestsellersClient({
  products,
  tabs,
}: {
  products: WoodmartProductCardData[]
  tabs: { id: string; label: string }[]
}) {
  const [activeTab, setActiveTab] = useState("all")

  const filtered = useMemo(() => {
    const matched =
      activeTab === "all"
        ? products
        : products.filter((product) =>
            product.categoryHandles.includes(activeTab)
          )

    return matched.slice(0, WEEKLY_BESTSELLERS_LIMIT)
  }, [activeTab, products])

  return (
    <section className="bg-[#faf9f7] py-14 small:py-16">
      <div className="content-container">
        <div className="mb-8 flex flex-col gap-4 small:flex-row small:items-center small:justify-between">
          <h2 className="font-display text-2xl font-semibold text-[#2d2d2d] small:text-3xl">
            Weekly bestsellers
          </h2>

          <ul className="flex flex-wrap items-center gap-6 border-b border-transparent small:border-none">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-1 text-sm font-medium transition ${
                    activeTab === tab.id
                      ? "border-b-2 border-[#2d2d2d] text-[#2d2d2d]"
                      : "text-[#888] hover:text-[#2d2d2d]"
                  }`}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-4 small:grid-cols-3 medium:grid-cols-4 large:grid-cols-5 small:gap-5">
          {filtered.map((product) => (
            <WoodmartProductCard key={product.id} product={product} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-[#888]">
            No products in this category yet.
          </p>
        )}
      </div>
    </section>
  )
}
