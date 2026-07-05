import Image from "next/image"

import { getCategoryImage } from "@lib/woodmart/catalog-helpers"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function CategoryHero({
  category,
}: {
  category: HttpTypes.StoreProductCategory
}) {
  const image = getCategoryImage(category)

  return (
    <section className="relative h-[200px] w-full overflow-hidden small:h-[240px]">
      <Image
        src={image}
        alt={category.name}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/35 to-black/10" />

      <div className="content-container relative flex h-full items-center">
        <LocalizedClientLink
          href="/"
          className="group flex items-center gap-3 font-display text-3xl font-semibold tracking-tight text-white small:text-4xl"
        >
          <span
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-xl transition group-hover:bg-white/20"
            aria-hidden
          >
            ←
          </span>
          {category.name}
        </LocalizedClientLink>
      </div>
    </section>
  )
}
