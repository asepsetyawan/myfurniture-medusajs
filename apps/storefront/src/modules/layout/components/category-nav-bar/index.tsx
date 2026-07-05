import {
  getCategoryHref,
  getCategoryIcon,
  sortActiveCategories,
} from "@lib/woodmart/catalog-helpers"
import { PROMO_FREE_SHIPPING_MINIMUM } from "@lib/woodmart/content"
import { HttpTypes } from "@medusajs/types"
import CategoryIcon from "@modules/common/components/category-icon"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function CategoryNavBar({
  categories,
}: {
  categories: HttpTypes.StoreProductCategory[]
}) {
  const navCategories = sortActiveCategories(categories)

  if (!navCategories.length) {
    return null
  }

  return (
    <nav
      aria-label="Product categories"
      className="flex min-w-0 flex-1 items-center"
    >
      <ul className="flex min-w-0 flex-1 items-center justify-start gap-x-5 overflow-x-auto py-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden medium:gap-x-6 medium:overflow-visible large:justify-between">
        {navCategories.map((category) => (
          <li key={category.id} className="shrink-0">
            <LocalizedClientLink
              href={getCategoryHref(category.handle!)}
              className="group flex items-center gap-2 whitespace-nowrap text-[#2d2d2d] transition-colors hover:text-[#111]"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center">
                <CategoryIcon
                  name={getCategoryIcon(category)}
                  className="h-[22px] w-[22px] stroke-[#2d2d2d] transition-colors group-hover:stroke-[#111]"
                />
              </span>
              <span className="text-sm font-normal">{category.name}</span>
            </LocalizedClientLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function HeaderPromoBadge() {
  return (
    <p className="shrink-0 self-center rounded-full bg-[#e3f2fa] px-3 py-1.5 text-[11px] font-medium leading-tight text-[#3d7a9e] small:px-4 small:py-2 small:text-xs">
      <span className="hidden small:inline">
        Free shipping for all orders of {PROMO_FREE_SHIPPING_MINIMUM}
      </span>
      <span className="small:hidden">
        Free shipping {PROMO_FREE_SHIPPING_MINIMUM}+
      </span>
    </p>
  )
}
