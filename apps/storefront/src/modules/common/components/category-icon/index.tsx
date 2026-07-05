type CategoryIconName =
  | "chair"
  | "table"
  | "sofa"
  | "armchair"
  | "bed"
  | "storage"
  | "textile"
  | "lighting"
  | "toy"
  | "decor"
  | string

type CategoryIconProps = {
  name: CategoryIconName
  className?: string
}

export default function CategoryIcon({ name, className = "" }: CategoryIconProps) {
  const iconClass = `h-6 w-6 stroke-current ${className}`.trim()

  switch (name) {
    case "table":
      return (
        <svg viewBox="0 0 32 32" fill="none" className={iconClass} aria-hidden>
          <path
            d="M4 14h24M6 14v10M26 14v10"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      )
    case "sofa":
      return (
        <svg viewBox="0 0 32 32" fill="none" className={iconClass} aria-hidden>
          <path
            d="M5 18h22v5H5v-5ZM7 18V14a3 3 0 013-3h12a3 3 0 013 3v4"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      )
    case "armchair":
      return (
        <svg viewBox="0 0 32 32" fill="none" className={iconClass} aria-hidden>
          <path
            d="M9 20h14v4H9v-4ZM10 20V13a4 4 0 014-4h4a4 4 0 014 4v7"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      )
    case "bed":
      return (
        <svg viewBox="0 0 32 32" fill="none" className={iconClass} aria-hidden>
          <path
            d="M4 18h24v5H4v-5ZM6 18V14h6v4M20 18V14h6v4"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      )
    case "storage":
      return (
        <svg viewBox="0 0 32 32" fill="none" className={iconClass} aria-hidden>
          <path
            d="M7 8h18v20H7V8ZM11 14h4M17 14h4M11 19h4M17 19h4"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      )
    case "textile":
      return (
        <svg viewBox="0 0 32 32" fill="none" className={iconClass} aria-hidden>
          <path
            d="M8 8h16v16H8V8ZM12 12h2v2h-2v-2ZM18 12h2v2h-2v-2ZM12 18h2v2h-2v-2ZM18 18h2v2h-2v-2Z"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      )
    case "lighting":
      return (
        <svg viewBox="0 0 32 32" fill="none" className={iconClass} aria-hidden>
          <path
            d="M16 5v4M11 20h10v3H11v-3ZM13 23v4h6v-4M10 12a6 6 0 1112 0c0 2-1 4-3 5H13c-2-1-3-3-3-5Z"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      )
    case "toy":
      return (
        <svg viewBox="0 0 32 32" fill="none" className={iconClass} aria-hidden>
          <path
            d="M8 22c0-4 3.5-8 8-8s8 4 8 8M12 22h8M16 10v2M14 12l2 2 2-2"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 24h12"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      )
    case "decor":
      return (
        <svg viewBox="0 0 32 32" fill="none" className={iconClass} aria-hidden>
          <path
            d="M11 10h4v14h-4V10ZM11 24c0-2 1-3 2-3s2 1 2 3M18 14h3v10h-3V14ZM18 24c0-1.5 1-2.5 1.5-2.5S21 22.5 21 24"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case "chair":
    default:
      return (
        <svg viewBox="0 0 32 32" fill="none" className={iconClass} aria-hidden>
          <path
            d="M10 14h12v10H10V14ZM12 14V10a4 4 0 014-4h0a4 4 0 014 4v4"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      )
  }
}
