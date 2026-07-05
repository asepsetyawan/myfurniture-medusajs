import { INDONESIA_SHIPPING_COURIERS } from "@lib/woodmart/content"

function JneLogo() {
  return (
    <svg viewBox="0 0 48 20" className="h-4 w-auto" aria-hidden>
      <rect width="48" height="20" rx="3" fill="#E30613" />
      <text
        x="24"
        y="14"
        textAnchor="middle"
        fill="#fff"
        fontSize="10"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
      >
        JNE
      </text>
    </svg>
  )
}

function JntLogo() {
  return (
    <svg viewBox="0 0 72 20" className="h-4 w-auto" aria-hidden>
      <rect width="72" height="20" rx="3" fill="#E30613" />
      <text
        x="36"
        y="14"
        textAnchor="middle"
        fill="#fff"
        fontSize="8"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
      >
        J&amp;T Express
      </text>
    </svg>
  )
}

function SicepatLogo() {
  return (
    <svg viewBox="0 0 64 20" className="h-4 w-auto" aria-hidden>
      <rect width="64" height="20" rx="3" fill="#D71149" />
      <text
        x="32"
        y="14"
        textAnchor="middle"
        fill="#fff"
        fontSize="9"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
      >
        SiCepat
      </text>
    </svg>
  )
}

function AnterajaLogo() {
  return (
    <svg viewBox="0 0 72 20" className="h-4 w-auto" aria-hidden>
      <rect width="72" height="20" rx="3" fill="#E30613" />
      <text
        x="36"
        y="14"
        textAnchor="middle"
        fill="#fff"
        fontSize="8.5"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
      >
        AnterAja
      </text>
    </svg>
  )
}

const LOGO_MAP = {
  jne: JneLogo,
  jnt: JntLogo,
  sicepat: SicepatLogo,
  anteraja: AnterajaLogo,
} as const

type FooterShippingMethodsProps = {
  variant?: "bar" | "column"
}

export default function FooterShippingMethods({
  variant = "column",
}: FooterShippingMethodsProps) {
  const isColumn = variant === "column"

  return (
    <div
      className={
        isColumn
          ? "flex flex-col gap-3"
          : "flex flex-col items-center gap-2 small:items-end"
      }
    >
      <span
        className={
          isColumn
            ? "text-sm font-semibold text-white"
            : "text-[10px] font-medium uppercase tracking-wide text-[#666] small:text-xs"
        }
      >
        Metode pengiriman
      </span>
      <ul
        className={
          isColumn
            ? "flex flex-wrap items-center gap-2"
            : "flex flex-wrap items-center justify-center gap-2 small:justify-end"
        }
        aria-label="Metode pengiriman"
      >
        {INDONESIA_SHIPPING_COURIERS.map((courier) => {
          const Logo = LOGO_MAP[courier.id]

          return (
            <li key={courier.id} role="listitem">
              <span
                className="inline-flex overflow-hidden rounded shadow-sm ring-1 ring-white/10"
                title={courier.label}
              >
                <Logo />
                <span className="sr-only">{courier.label}</span>
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
