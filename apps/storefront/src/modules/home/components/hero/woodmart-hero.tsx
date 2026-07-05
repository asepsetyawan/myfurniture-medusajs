"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

import { WoodmartHeroSlideData } from "@lib/woodmart/catalog-helpers"
import { WOODMART_HERO_SLIDES } from "@lib/woodmart/content"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function WoodmartHero({
  slides: slidesFromBackend,
}: {
  slides?: WoodmartHeroSlideData[]
}) {
  const slides =
    slidesFromBackend && slidesFromBackend.length > 0
      ? slidesFromBackend
      : WOODMART_HERO_SLIDES.map((slide) => ({
          id: String(slide.id),
          image: slide.image,
          authorImage: slide.authorImage,
          authorName: slide.authorName,
          category: slide.category,
          categoryHref: slide.categoryHref,
          title: slide.title,
          price: slide.price,
          cta: slide.cta,
          ctaHref: slide.ctaHref,
        }))

  const [active, setActive] = useState(0)
  const slide = slides[active]

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <section className="relative min-h-[420px] w-full overflow-hidden bg-[#f5f0eb] small:min-h-[520px]">
      <div key={slide.id} className="absolute inset-0 animate-fade-in">
        <Image
          src={slide.image}
          alt=""
          fill
          priority
          className="object-cover object-right"
          sizes="100vw"
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-[#e8ddd0]/95 via-[#e8ddd0]/75 to-transparent small:max-w-[60%]" />

      <div className="relative z-[2] flex min-h-[420px] items-center small:min-h-[520px]">
        <div className="content-container w-full py-16 small:py-20">
          <div key={`content-${slide.id}`} className="max-w-xl animate-fade-in">
            <p className="mb-4 flex items-center gap-2 text-sm text-[#5c5c5c]">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-lg shadow-sm">
                🛋
              </span>
              <span>
                Discover more products in the{" "}
                <LocalizedClientLink
                  href={slide.categoryHref}
                  className="font-medium underline decoration-[#2d2d2d]/40 underline-offset-2"
                >
                  {slide.category}
                </LocalizedClientLink>{" "}
                category
              </span>
            </p>

            <h1 className="font-display text-3xl font-semibold leading-tight text-[#2d2d2d] small:text-4xl medium:text-[2.75rem]">
              {slide.title}{" "}
              <span className="inline-flex flex-wrap items-center gap-2">
                <Image
                  src={slide.authorImage}
                  alt={slide.authorName}
                  width={36}
                  height={36}
                  className="rounded-full border-2 border-white shadow-sm"
                />
                {slide.authorName}
              </span>
            </h1>

            <div className="mt-8 flex flex-wrap items-center gap-6">
              <LocalizedClientLink
                href={slide.ctaHref}
                className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-[#2d2d2d] shadow-md transition hover:bg-[#fafafa] hover:shadow-lg"
              >
                {slide.cta}
              </LocalizedClientLink>
              {slide.price ? (
                <span className="font-display text-4xl font-semibold text-[#2d2d2d]">
                  {slide.price}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-[3] flex -translate-x-1/2 gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setActive(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === active ? "w-8 bg-[#2d2d2d]" : "w-2 bg-[#2d2d2d]/30"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
