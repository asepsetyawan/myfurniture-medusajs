import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items

  return (
    <div>
      <ul className="flex flex-col divide-y divide-[#eee]">
        {items
          ? items
              .sort((a, b) => {
                return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
              })
              .map((item) => (
                <li key={item.id} className="py-6 first:pt-0 last:pb-0">
                  <Item
                    item={item}
                    currencyCode={cart?.currency_code}
                  />
                </li>
              ))
          : repeat(3).map((i) => (
              <li key={i} className="py-6">
                <SkeletonLineItem />
              </li>
            ))}
      </ul>
    </div>
  )
}

export default ItemsTemplate
