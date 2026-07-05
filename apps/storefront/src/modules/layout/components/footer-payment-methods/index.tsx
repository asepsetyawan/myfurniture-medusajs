import { INDONESIA_PAYMENT_METHODS } from "@lib/woodmart/content"

function QrisLogo() {
  return (
    <svg viewBox="0 0 64 20" className="h-4 w-auto" aria-hidden>
      <rect width="64" height="20" rx="3" fill="#ED1C24" />
      <rect x="6" y="5" width="10" height="10" rx="1" fill="#fff" opacity="0.95" />
      <rect x="8" y="7" width="2" height="2" fill="#ED1C24" />
      <rect x="11" y="7" width="2" height="2" fill="#ED1C24" />
      <rect x="8" y="10" width="2" height="2" fill="#ED1C24" />
      <rect x="11" y="10" width="5" height="2" fill="#ED1C24" />
      <text
        x="40"
        y="14"
        textAnchor="middle"
        fill="#fff"
        fontSize="9"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
      >
        QRIS
      </text>
    </svg>
  )
}

function OvoLogo() {
  return (
    <svg viewBox="0 0 48 20" className="h-4 w-auto" aria-hidden>
      <rect width="48" height="20" rx="3" fill="#4C3494" />
      <text
        x="24"
        y="14"
        textAnchor="middle"
        fill="#fff"
        fontSize="9"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
      >
        OVO
      </text>
    </svg>
  )
}

function GopayLogo() {
  return (
    <svg viewBox="0 0 56 20" className="h-4 w-auto" aria-hidden>
      <rect width="56" height="20" rx="3" fill="#00AA13" />
      <text
        x="28"
        y="14"
        textAnchor="middle"
        fill="#fff"
        fontSize="8.5"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
      >
        GoPay
      </text>
    </svg>
  )
}

function DanaLogo() {
  return (
    <svg viewBox="0 0 48 20" className="h-4 w-auto" aria-hidden>
      <rect width="48" height="20" rx="3" fill="#118EEA" />
      <text
        x="24"
        y="14"
        textAnchor="middle"
        fill="#fff"
        fontSize="9"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
      >
        DANA
      </text>
    </svg>
  )
}

function ShopeePayLogo() {
  return (
    <svg viewBox="0 0 72 20" className="h-4 w-auto" aria-hidden>
      <rect width="72" height="20" rx="3" fill="#EE4D2D" />
      <text
        x="36"
        y="14"
        textAnchor="middle"
        fill="#fff"
        fontSize="8"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
      >
        ShopeePay
      </text>
    </svg>
  )
}

function LinkAjaLogo() {
  return (
    <svg viewBox="0 0 64 20" className="h-4 w-auto" aria-hidden>
      <rect width="64" height="20" rx="3" fill="#E82529" />
      <text
        x="32"
        y="14"
        textAnchor="middle"
        fill="#fff"
        fontSize="8"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
      >
        LinkAja
      </text>
    </svg>
  )
}

function VisaLogo() {
  return (
    <svg viewBox="0 0 48 20" className="h-4 w-auto" aria-hidden>
      <rect width="48" height="20" rx="3" fill="#fff" />
      <text
        x="24"
        y="14.5"
        textAnchor="middle"
        fill="#1A1F71"
        fontSize="10"
        fontWeight="700"
        fontStyle="italic"
        fontFamily="system-ui, sans-serif"
      >
        VISA
      </text>
    </svg>
  )
}

function MastercardLogo() {
  return (
    <svg viewBox="0 0 48 20" className="h-4 w-auto" aria-hidden>
      <rect width="48" height="20" rx="3" fill="#fff" />
      <circle cx="19" cy="10" r="6" fill="#EB001B" opacity="0.95" />
      <circle cx="29" cy="10" r="6" fill="#F79E1B" opacity="0.95" />
    </svg>
  )
}

function BankTransferLogo() {
  return (
    <svg viewBox="0 0 72 20" className="h-4 w-auto" aria-hidden>
      <rect width="72" height="20" rx="3" fill="#1a1a1a" stroke="#444" />
      <text
        x="36"
        y="14"
        textAnchor="middle"
        fill="#e5e5e5"
        fontSize="7.5"
        fontWeight="600"
        fontFamily="system-ui, sans-serif"
      >
        Bank Transfer
      </text>
    </svg>
  )
}

const LOGO_MAP = {
  qris: QrisLogo,
  ovo: OvoLogo,
  gopay: GopayLogo,
  dana: DanaLogo,
  shopeepay: ShopeePayLogo,
  linkaja: LinkAjaLogo,
  visa: VisaLogo,
  mastercard: MastercardLogo,
  bank_transfer: BankTransferLogo,
} as const

type FooterPaymentMethodsProps = {
  variant?: "bar" | "column"
}

export default function FooterPaymentMethods({
  variant = "bar",
}: FooterPaymentMethodsProps) {
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
        Metode pembayaran
      </span>
      <ul
        className={
          isColumn
            ? "flex flex-wrap items-center gap-2"
            : "flex flex-wrap items-center justify-center gap-2 small:justify-end"
        }
        aria-label="Metode pembayaran"
      >
        {INDONESIA_PAYMENT_METHODS.map((method) => {
          const Logo = LOGO_MAP[method.id]

          return (
            <li key={method.id} role="listitem">
              <span
                className="inline-flex overflow-hidden rounded shadow-sm ring-1 ring-white/10"
                title={method.label}
              >
                <Logo />
                <span className="sr-only">{method.label}</span>
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
