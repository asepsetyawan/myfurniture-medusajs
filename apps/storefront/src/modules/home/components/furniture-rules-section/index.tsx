import Image from "next/image"

import { WOODMART_FURNITURE_RULES } from "@lib/woodmart/content"

function PlayButton() {
  return (
    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 shadow-lg transition group-hover:scale-105">
      <svg
        width="18"
        height="20"
        viewBox="0 0 18 20"
        fill="none"
        aria-hidden
        className="ml-1"
      >
        <path
          d="M16.5 8.27a1.5 1.5 0 010 2.46l-13 8.5A1.5 1.5 0 011 17.77V2.23A1.5 1.5 0 013.5.77l13 7.5z"
          fill="#2d2d2d"
        />
      </svg>
    </span>
  )
}

export default function FurnitureRulesSection() {
  const rules = WOODMART_FURNITURE_RULES

  return (
    <section className="overflow-hidden bg-[#f7f4f0] pb-8 pt-14 small:pb-12 small:pt-16">
      <div className="content-container">
        <h2 className="mb-10 font-display text-2xl font-semibold text-[#2d2d2d] small:mb-12 small:text-3xl">
          Rules for choosing furniture
        </h2>

        <div className="grid items-start gap-10 large:grid-cols-2 large:gap-16">
          <div className="relative mx-auto w-full max-w-md large:max-w-none">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
            >
              <span className="absolute -left-6 top-8 h-40 w-40 rounded-full bg-[#e8e2da]/80 blur-sm" />
              <span className="absolute bottom-16 right-0 h-52 w-52 rounded-[40%] bg-[#d9d2c8]/60" />
              <span className="absolute bottom-4 left-12 h-6 w-6 rounded-full bg-[#c4a574]/50" />
              <span className="absolute right-16 top-24 h-4 w-4 rounded-full bg-[#c4a574]/40" />
              <span className="absolute left-1/3 top-1/2 h-3 w-3 rounded-full bg-[#c4a574]/35" />
            </div>

            <div className="relative z-10 aspect-[580/620] w-full">
              <Image
                src={rules.chairImage}
                alt="Modern armchair"
                fill
                className="object-contain object-bottom"
                sizes="(max-width: 1024px) 90vw, 45vw"
              />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-lg font-semibold leading-snug text-[#2d2d2d] small:text-xl">
                {rules.lead}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-[#6b6b6b] small:text-base">
                {rules.body}
              </p>
              <ul className="mt-6 space-y-3">
                {rules.tips.map((tip) => (
                  <li
                    key={tip}
                    className="flex items-start gap-3 text-sm text-[#4a4a4a] small:text-base"
                  >
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f59a57]"
                      aria-hidden
                    />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* <a
              href={rules.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative z-20 mx-auto mt-2 block w-full max-w-lg large:mx-0 large:ml-auto large:mr-0 large:translate-y-8"
            >
              <div className="relative aspect-[2.4/1] overflow-hidden rounded-[50%] shadow-xl">
                <Image
                  src={rules.videoImage}
                  alt=""
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 90vw, 480px"
                />
                <div className="absolute inset-0 bg-black/25 transition group-hover:bg-black/35" />

                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center text-white">
                  <PlayButton />
                  <div>
                    <p className="text-sm font-medium tracking-wide opacity-90">
                      {rules.videoTitle}
                    </p>
                    <p className="mt-1 font-display text-lg font-semibold small:text-xl">
                      {rules.videoSubtitle}
                    </p>
                  </div>
                </div>
              </div>
            </a> */}
          </div>
        </div>
      </div>
    </section>
  )
}
