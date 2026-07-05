import Image from "next/image"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function StoreHero({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) {
  return (
    <section className="relative h-[200px] w-full overflow-hidden small:h-[240px]">
      <Image
        src="/images/woodmart/hero/slider-2.jpg"
        alt=""
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/35 to-black/10" />

      <div className="content-container relative flex h-full flex-col justify-center">
        <LocalizedClientLink
          href="/"
          className="mb-3 text-xs font-medium uppercase tracking-wider text-white/70 transition hover:text-white"
        >
          Home
        </LocalizedClientLink>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-white small:text-4xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-2 max-w-xl text-sm text-white/85">{subtitle}</p>
        ) : null}
      </div>
    </section>
  )
}
