import Image from "next/image"

import { WOODMART_BRANDS } from "@lib/woodmart/content"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function BrandsSection() {
  return (
    <section className="bg-white py-14 small:py-16">
      <div className="content-container">
        <div className="mb-10 text-center">
          <h2 className="font-display text-2xl font-semibold text-[#2d2d2d] small:text-3xl">
            Shopping by brands
          </h2>
          <p className="mt-2 text-base text-[#6b6b6b]">
            Discover lots products from popular brands
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 xsmall:grid-cols-2 small:grid-cols-3 medium:grid-cols-5">
          {WOODMART_BRANDS.map((brand) => (
            <LocalizedClientLink
              key={brand.id}
              href={brand.href}
              className="group relative block aspect-[3/4] overflow-hidden rounded-2xl"
            >
              <Image
                src={brand.image}
                alt={brand.name}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 20vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

              <div className="absolute left-4 top-4 flex items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-white p-1 shadow-md">
                  <Image
                    src={brand.logo}
                    alt=""
                    fill
                    className="object-contain p-1"
                    sizes="48px"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{brand.name}</p>
                  <p className="text-xs text-white/80">{brand.location}</p>
                </div>
              </div>
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </section>
  )
}
