"use client"

import { useWishlist } from "@lib/wishlist/wishlist-context"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

import HeaderIconLink, { UserIcon, WishlistIcon } from "../header-icon-link"

function getAccountLabel(customer: HttpTypes.StoreCustomer): string {
  const firstName = customer.first_name?.trim()
  if (firstName) {
    return firstName
  }

  const emailLocal = customer.email?.split("@")[0]?.trim()
  if (emailLocal) {
    return emailLocal
  }

  return "Akun"
}

type WoodmartHeaderActionsProps = {
  customer: HttpTypes.StoreCustomer | null
}

export default function WoodmartHeaderActions({
  customer,
}: WoodmartHeaderActionsProps) {
  const { count } = useWishlist()
  const isLoggedIn = Boolean(customer)
  const accountLabel = customer ? getAccountLabel(customer) : "Login / Register"
  const accountAriaLabel = isLoggedIn
    ? `Akun: ${accountLabel}`
    : "Login or register"

  return (
    <div className="flex shrink-0 items-center gap-2 small:gap-3">
      <HeaderIconLink href="/wishlist" label="Wishlist" count={count}>
        <WishlistIcon />
      </HeaderIconLink>

      <LocalizedClientLink
        href="/account"
        className="hidden items-center gap-2 rounded-full border border-[#e8e8e8] bg-[#efefef] px-4 py-2.5 text-sm text-[#333] transition hover:bg-[#e8e8e8] small:flex"
      >
        <UserIcon />
        <span className="max-w-[140px] truncate whitespace-nowrap">
          {accountLabel}
        </span>
      </LocalizedClientLink>

      <LocalizedClientLink
        href="/account"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e8e8e8] bg-[#efefef] text-[#333] small:hidden"
        aria-label={accountAriaLabel}
      >
        <UserIcon />
      </LocalizedClientLink>
    </div>
  )
}
