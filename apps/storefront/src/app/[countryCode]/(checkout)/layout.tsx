import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"
import WoodmartLogo from "@modules/layout/components/woodmart-logo"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen w-full bg-[#f7f4f0]">
      <header className="border-b border-[#eee] bg-white">
        <nav className="content-container flex h-16 items-center justify-between">
          <LocalizedClientLink
            href="/cart"
            className="flex flex-1 basis-0 items-center gap-x-2 text-sm font-medium text-[#666] transition hover:text-[#2d2d2d]"
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="hidden small:inline">Back to cart</span>
            <span className="small:hidden">Back</span>
          </LocalizedClientLink>
          <WoodmartLogo
            imageClassName="h-8 w-auto"
            brandClassName="font-display text-lg text-[#2d2d2d]"
            className="justify-center"
            data-testid="store-link"
          />
          <div className="flex-1 basis-0" />
        </nav>
      </header>

      <main className="relative" data-testid="checkout-container">
        {children}
      </main>
    </div>
  )
}
