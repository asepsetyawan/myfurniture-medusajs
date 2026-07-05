"use client"

import { Button } from "@modules/common/components/ui"
import CartTotals from "@modules/common/components/cart-totals"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

type SummaryProps = {
  cart: HttpTypes.StoreCart
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  }
  if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  }
  return "payment"
}

const Summary = ({ cart }: SummaryProps) => {
  const step = getCheckoutStep(cart)

  return (
    <div className="flex flex-col gap-y-6">
      <h2 className="font-display text-xl font-semibold text-[#2d2d2d]">
        Order summary
      </h2>
      <DiscountCode cart={cart} />
      <CartTotals totals={cart} />
      <LocalizedClientLink
        href={"/checkout?step=" + step}
        data-testid="checkout-button"
      >
        <Button className="h-12 w-full rounded-md bg-[#2d2d2d] text-sm font-semibold uppercase tracking-wide hover:bg-[#111]">
          Proceed to checkout
        </Button>
      </LocalizedClientLink>
      <LocalizedClientLink
        href="/store"
        className="block text-center text-sm text-[#888] transition hover:text-[#2d2d2d]"
      >
        Continue shopping
      </LocalizedClientLink>
    </div>
  )
}

export default Summary
