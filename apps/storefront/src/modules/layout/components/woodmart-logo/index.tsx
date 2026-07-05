import Image from "next/image"

import { MYFURNITURE_BRAND, MYFURNITURE_LOGO_SRC } from "@lib/woodmart/content"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type WoodmartLogoProps = {
  imageClassName?: string
  brandClassName?: string
  showBrand?: boolean
  linked?: boolean
  className?: string
  priority?: boolean
  "data-testid"?: string
}

export default function WoodmartLogo({
  imageClassName = "h-9 w-auto",
  brandClassName = "font-display text-[1.65rem] font-bold leading-none tracking-tight text-[#1a1a1a]",
  showBrand = true,
  linked = true,
  className,
  priority = true,
  "data-testid": dataTestId,
}: WoodmartLogoProps) {
  const content = (
    <>
      <Image
        src={MYFURNITURE_LOGO_SRC}
        alt=""
        width={500}
        height={500}
        className={imageClassName}
        priority={priority}
        aria-hidden
      />
      {showBrand && <span className={brandClassName}>{MYFURNITURE_BRAND}</span>}
    </>
  )

  if (!linked) {
    return (
      <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
        {content}
      </span>
    )
  }

  return (
    <LocalizedClientLink
      href="/"
      className={`flex shrink-0 items-center gap-2.5 ${className ?? ""}`}
      aria-label="myfurniture home"
      data-testid={dataTestId}
    >
      {content}
    </LocalizedClientLink>
  )
}
