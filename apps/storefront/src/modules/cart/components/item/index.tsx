"use client"

import { updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import CartItemSelect from "@modules/cart/components/cart-item-select"
import ErrorMessage from "@modules/checkout/components/error-message"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import Image from "next/image"
import { useState } from "react"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
}

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)

    await updateLineItem({
      lineId: item.id,
      quantity,
    })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setUpdating(false)
      })
  }

  const maxQtyFromInventory = 10
  const maxQuantity = item.variant?.manage_inventory ? 10 : maxQtyFromInventory

  const thumbnail = item.thumbnail ?? item.variant?.product?.images?.[0]?.url

  if (type === "preview") {
    return (
      <div
        className="flex gap-4 py-4"
        data-testid="product-row"
      >
        <LocalizedClientLink
          href={`/products/${item.product_handle}`}
          className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#f5f5f5]"
        >
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={item.product_title ?? ""}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : null}
        </LocalizedClientLink>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[#2d2d2d]">
            {item.product_title}
          </p>
          <LineItemOptions variant={item.variant} />
          <p className="mt-1 text-sm text-[#888]">
            {item.quantity} ×{" "}
            <LineItemUnitPrice
              item={item}
              style="tight"
              currencyCode={currencyCode}
            />
          </p>
        </div>
        <LineItemPrice
          item={item}
          style="tight"
          currencyCode={currencyCode}
        />
      </div>
    )
  }

  return (
    <article
      className="flex flex-col gap-4 small:flex-row small:items-center"
      data-testid="product-row"
    >
      <LocalizedClientLink
        href={`/products/${item.product_handle}`}
        className="relative h-28 w-28 shrink-0 overflow-hidden rounded-lg bg-[#f5f5f5] ring-1 ring-[#eee]"
      >
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={item.product_title ?? ""}
            fill
            className="object-cover"
            sizes="112px"
          />
        ) : (
          <span className="flex h-full items-center justify-center px-2 text-center text-xs text-[#999]">
            {item.product_title}
          </span>
        )}
      </LocalizedClientLink>

      <div className="min-w-0 flex-1">
        <LocalizedClientLink
          href={`/products/${item.product_handle}`}
          className="text-base font-semibold text-[#2d2d2d] hover:text-[#111]"
          data-testid="product-title"
        >
          {item.product_title}
        </LocalizedClientLink>
        <LineItemOptions variant={item.variant} data-testid="product-variant" />

        <div className="mt-3 hidden text-sm text-[#888] small:block">
          <LineItemUnitPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 small:flex-col small:items-end">
        <div className="flex items-center gap-2">
          <DeleteButton id={item.id} data-testid="product-delete-button" />
          <CartItemSelect
            value={item.quantity}
            onChange={(value) =>
              changeQuantity(parseInt(value.target.value, 10))
            }
            className="h-10 w-16 rounded-md border border-[#e5e5e5] p-2 text-sm"
            data-testid="product-select-button"
          >
            {Array.from(
              { length: Math.min(maxQuantity, 10) },
              (_, i) => (
                <option value={i + 1} key={i + 1}>
                  {i + 1}
                </option>
              )
            )}
          </CartItemSelect>
          {updating ? <Spinner /> : null}
        </div>
        <ErrorMessage error={error} data-testid="product-error-message" />

        <p className="text-lg font-semibold text-[#e67e22]">
          <LineItemPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </p>
      </div>
    </article>
  )
}

export default Item
