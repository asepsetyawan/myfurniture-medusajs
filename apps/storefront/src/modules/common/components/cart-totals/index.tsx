"use client"

import { convertToLocale } from "@lib/util/money"
import React from "react"

type CartTotalsProps = {
  totals: {
    total?: number | null
    subtotal?: number | null
    tax_total?: number | null
    currency_code: string
    item_subtotal?: number | null
    shipping_subtotal?: number | null
    discount_subtotal?: number | null
  }
}

const rowClass = "flex items-center justify-between text-sm text-[#666]"

const CartTotals: React.FC<CartTotalsProps> = ({ totals }) => {
  const {
    currency_code,
    total,
    tax_total,
    item_subtotal,
    shipping_subtotal,
    discount_subtotal,
  } = totals

  return (
    <div className="flex flex-col gap-y-3">
      <div className={rowClass}>
        <span>Subtotal</span>
        <span data-testid="cart-subtotal" data-value={item_subtotal || 0}>
          {convertToLocale({ amount: item_subtotal ?? 0, currency_code })}
        </span>
      </div>
      <div className={rowClass}>
        <span>Shipping</span>
        <span data-testid="cart-shipping" data-value={shipping_subtotal || 0}>
          {convertToLocale({ amount: shipping_subtotal ?? 0, currency_code })}
        </span>
      </div>
      {!!discount_subtotal && (
        <div className={rowClass}>
          <span>Discount</span>
          <span
            className="text-[#27ae60]"
            data-testid="cart-discount"
            data-value={discount_subtotal || 0}
          >
            −{" "}
            {convertToLocale({
              amount: discount_subtotal ?? 0,
              currency_code,
            })}
          </span>
        </div>
      )}
      <div className={rowClass}>
        <span>Taxes</span>
        <span data-testid="cart-taxes" data-value={tax_total || 0}>
          {convertToLocale({ amount: tax_total ?? 0, currency_code })}
        </span>
      </div>

      <div className="my-2 h-px w-full bg-[#eee]" />

      <div className="flex items-center justify-between">
        <span className="text-base font-semibold text-[#2d2d2d]">Total</span>
        <span
          className="text-xl font-semibold text-[#e67e22]"
          data-testid="cart-total"
          data-value={total || 0}
        >
          {convertToLocale({ amount: total ?? 0, currency_code })}
        </span>
      </div>
    </div>
  )
}

export default CartTotals
