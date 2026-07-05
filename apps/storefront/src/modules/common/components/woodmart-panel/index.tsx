import { ReactNode } from "react"

export default function WoodmartPanel({
  title,
  action,
  children,
  className = "",
}: {
  title: string
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={`rounded-lg border border-[#eee] bg-white p-6 shadow-sm small:p-8 ${className}`}
    >
      <div className="mb-6 flex flex-row items-center justify-between gap-4">
        <h2 className="font-display text-xl font-semibold text-[#2d2d2d] small:text-2xl">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  )
}
