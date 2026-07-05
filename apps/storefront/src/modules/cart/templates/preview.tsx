"use client"

import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  cart: HttpTypes.StoreCart
}

const ItemsPreviewTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart.items

  return (
    <ul className="flex flex-col divide-y divide-[#eee]">
      {items
        ? items
            .sort((a, b) => {
              return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
            })
            .map((item) => (
              <li key={item.id}>
                <Item
                  item={item}
                  type="preview"
                  currencyCode={cart.currency_code}
                />
              </li>
            ))
        : repeat(3).map((i) => (
            <li key={i} className="py-4">
              <SkeletonLineItem />
            </li>
          ))}
    </ul>
  )
}

export default ItemsPreviewTemplate
