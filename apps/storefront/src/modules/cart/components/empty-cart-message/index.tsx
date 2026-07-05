import LocalizedClientLink from "@modules/common/components/localized-client-link"

const EmptyCartMessage = () => {
  return (
    <div
      className="rounded-xl border border-dashed border-[#e0e0e0] bg-white px-6 py-16 text-center shadow-sm"
      data-testid="empty-cart-message"
    >
      <p className="mb-2 font-display text-xl font-semibold text-[#2d2d2d]">
        Your cart is empty
      </p>
      <p className="mb-6 text-sm text-[#6b6b6b]">
        Discover furniture and decor curated for your home.
      </p>
      <LocalizedClientLink
        href="/store"
        className="inline-flex rounded-full bg-[#2d2d2d] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#111]"
      >
        Explore products
      </LocalizedClientLink>
    </div>
  )
}

export default EmptyCartMessage
