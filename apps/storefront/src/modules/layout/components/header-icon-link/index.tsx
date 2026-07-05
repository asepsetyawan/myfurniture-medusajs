import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ReactNode } from "react"

type HeaderIconLinkProps = {
  href: string
  label: string
  count?: number
  children: ReactNode
}

export default function HeaderIconLink({
  href,
  label,
  count = 0,
  children,
}: HeaderIconLinkProps) {
  return (
    <LocalizedClientLink
      href={href}
      className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-[#e8e8e8] bg-white text-[#2d2d2d] transition hover:border-[#d0d0d0] hover:bg-[#fafafa]"
      aria-label={label}
    >
      {children}
      {count > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#e85d04] px-1 text-[10px] font-semibold leading-none text-white">
          {count}
        </span>
      ) : null}
    </LocalizedClientLink>
  )
}

export function WishlistIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 20.5 4.5 12.9a5.5 5.5 0 0 1 7.8-7.8L12 6.8l-.3-.3a5.5 5.5 0 0 1 7.8 7.8L12 20.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6h15l-1.5 9h-12L6 6ZM6 6 5 3H2M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
