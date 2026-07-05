import Image from "next/image"

import {
  WOODMART_TOP_BAR,
  WOODMART_TOP_LINKS,
} from "@lib/woodmart/content"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

import TopBarCurrencySelect from "./top-bar-currency-select"

function TopBarDivider() {
  return <span className="h-3.5 w-px shrink-0 bg-[#d8d8d8]" aria-hidden />
}

function PhoneIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0 text-[#555]"
      aria-hidden
    >
      <path
        d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A15 15 0 013 6a2 2 0 012-2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function HeaderTopBar({
  regions,
}: {
  regions: HttpTypes.StoreRegion[]
}) {
  return (
    <div className="border-b border-[#ebe8e3] bg-[#f3f3f1]">
      <div className="content-container flex h-9 items-center justify-between text-xs text-[#555]">
        <div className="flex min-w-0 items-center gap-3 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="relative shrink-0">
            <TopBarCurrencySelect regions={regions} />
          </div>

          <TopBarDivider />

          <nav
            aria-label="Utility links"
            className="flex shrink-0 items-center gap-3"
          >
            {WOODMART_TOP_LINKS.map((link) => (
              <LocalizedClientLink
                key={link.label}
                href={link.href}
                className="whitespace-nowrap transition hover:text-[#111]"
              >
                {link.label}
              </LocalizedClientLink>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-3 small:flex">
          <a
            href={`tel:${WOODMART_TOP_BAR.phone.replace(/[^\d+]/g, "")}`}
            className="flex items-center gap-1.5 whitespace-nowrap transition hover:text-[#111]"
          >
            <PhoneIcon />
            <span>{WOODMART_TOP_BAR.phone}</span>
          </a>

          <TopBarDivider />

          <LocalizedClientLink
            href={WOODMART_TOP_BAR.expertLink}
            className="flex items-center gap-2 whitespace-nowrap transition hover:text-[#111]"
          >
            <span className="flex items-center -space-x-1.5">
              {WOODMART_TOP_BAR.expertAvatars.map((src, index) => (
                <span
                  key={src}
                  className="relative h-6 w-6 overflow-hidden rounded-full border-2 border-[#f3f3f1] bg-[#e8e8e8]"
                  style={{ zIndex: WOODMART_TOP_BAR.expertAvatars.length - index }}
                >
                  <Image
                    src={src}
                    alt=""
                    width={24}
                    height={24}
                    className="h-full w-full object-cover"
                  />
                </span>
              ))}
            </span>
            <span>Contact with an expert</span>
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}
