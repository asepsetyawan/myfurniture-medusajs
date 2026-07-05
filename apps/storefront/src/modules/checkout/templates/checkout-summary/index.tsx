import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import { HttpTypes } from "@medusajs/types"

const CheckoutSummary = ({ cart }: { cart: HttpTypes.StoreCart }) => {
  return (
    <aside className="sticky top-24">
      <div className="rounded-lg border border-[#eee] bg-white p-6 shadow-sm small:p-8">
        <h2 className="mb-6 font-display text-xl font-semibold text-[#2d2d2d]">
          Your order
        </h2>

        <div className="mb-6 max-h-[320px] overflow-y-auto no-scrollbar">
          <ItemsPreviewTemplate cart={cart} />
        </div>

        <div className="mb-6 h-px w-full bg-[#eee]" />

        <CartTotals totals={cart} />

        <div className="mt-6">
          <DiscountCode cart={cart} />
        </div>
      </div>
    </aside>
  )
}

export default CheckoutSummary
