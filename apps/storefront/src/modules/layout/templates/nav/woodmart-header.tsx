import { Suspense } from "react"

import { HttpTypes } from "@medusajs/types"
import CartButton from "@modules/layout/components/cart-button"
import HeaderTopBar from "@modules/layout/components/header-top-bar"
import CategoryNavBar, {
  HeaderPromoBadge,
} from "@modules/layout/components/category-nav-bar"
import WoodmartHeaderActions from "@modules/layout/components/woodmart-header-actions"
import WoodmartLogo from "@modules/layout/components/woodmart-logo"
import WoodmartSearch from "@modules/layout/components/woodmart-search"

export default function WoodmartHeader({
  categories,
  regions,
  customer,
}: {
  categories: HttpTypes.StoreProductCategory[]
  regions: HttpTypes.StoreRegion[]
  customer: HttpTypes.StoreCustomer | null
}) {
  return (
    <div className="sticky top-0 z-50 w-full">
      <HeaderTopBar regions={regions} />
      <header className="w-full border-b border-[#ebe8e3] bg-[#f9f9f7] shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <div className="content-container">
          <div className="flex w-full flex-col gap-4 py-4 small:flex-row small:items-center small:gap-4 small:py-5">
            <WoodmartLogo />

            <div className="order-3 min-w-0 flex-1 small:order-none">
              <Suspense fallback={<WoodmartSearchFallback />}>
                <WoodmartSearch regions={regions} />
              </Suspense>
            </div>

            <div className="order-2 flex shrink-0 items-center gap-2 small:order-none small:gap-3">
              <WoodmartHeaderActions customer={customer} />
              <Suspense
                fallback={
                  <div className="rounded-full bg-[#1a1a1a] px-4 py-2.5 text-sm font-medium text-white">
                    €0.00
                  </div>
                }
              >
                <WoodmartCartButton />
              </Suspense>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-[#ebe8e3]/80 pb-4 pt-3 small:flex-row small:items-center small:justify-between sm:gap-4">
            <CategoryNavBar categories={categories} />
            <HeaderPromoBadge />
          </div>
        </div>
      </header>
    </div>
  )
}

async function WoodmartCartButton() {
  return <CartButton />
}

function WoodmartSearchFallback() {
  return (
    <div className="h-[46px] w-full rounded-full border border-[#e0e0e0] bg-white" />
  )
}
