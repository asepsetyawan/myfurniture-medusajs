import Image from "next/image"

import {
  getCategoryHref,
  getCategoryImage,
  sortActiveCategories,
} from "@lib/woodmart/catalog-helpers"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function CategoriesSection({
  categories,
}: {
  categories: HttpTypes.StoreProductCategory[]
}) {
  const sorted = sortActiveCategories(categories)

  return (
    <section className="bg-[#f7f4f0] py-16 small:py-20">
      <div className="content-container">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-semibold text-[#2d2d2d] small:text-4xl">
            Our categories
          </h2>
          <p className="mt-2 text-base text-[#6b6b6b]">
            Lots of new products and product collections
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 small:grid-cols-3 medium:grid-cols-5">
          {sorted.map((category) => (
            <LocalizedClientLink
              key={category.id}
              href={getCategoryHref(category.handle!)}
              className="group flex flex-col items-center"
            >
              <div className="relative aspect-square w-full max-w-[200px] overflow-hidden rounded-full shadow-md transition-transform duration-300 group-hover:scale-[1.03]">
                <Image
                  src={getCategoryImage(category)}
                  alt={category.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 200px"
                />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#2d2d2d] shadow-sm">
                  {category.name}
                </span>
              </div>
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </section>
  )
}
