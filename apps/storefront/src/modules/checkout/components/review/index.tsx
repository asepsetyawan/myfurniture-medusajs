"use client"

import PaymentButton from "../payment-button"
import { useSearchParams } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { CheckCircleSolid } from "@medusajs/icons"
import { clx } from "@modules/common/components/ui"

const Review = ({ cart }: { cart: HttpTypes.StoreCart }) => {
  const searchParams = useSearchParams()

  const isOpen = searchParams.get("step") === "review"

  const paidByGiftcard = !!(
    (cart as unknown as Record<string, unknown>)?.gift_cards &&
    ((cart as unknown as Record<string, unknown>)?.gift_cards as unknown[])
      ?.length > 0 &&
    cart?.total === 0
  )

  const previousStepsCompleted =
    cart.shipping_address &&
    (cart.shipping_methods?.length ?? 0) > 0 &&
    (cart.payment_collection || paidByGiftcard)

  return (
    <section className="rounded-lg border border-[#eee] bg-white p-6 shadow-sm small:p-8">
      <h2
        className={clx(
          "mb-6 flex flex-row items-center gap-2 font-display text-xl font-semibold text-[#2d2d2d] small:text-2xl",
          {
            "pointer-events-none select-none opacity-50": !isOpen,
          }
        )}
      >
        Review
        {!isOpen && previousStepsCompleted && (
          <CheckCircleSolid className="text-[#27ae60]" />
        )}
      </h2>

      {isOpen && previousStepsCompleted && (
        <>
          <p className="mb-6 text-sm leading-relaxed text-[#666]">
            By placing your order, you confirm that you have read and accept our
            Terms of Use, Terms of Sale, and Returns Policy.
          </p>
          <PaymentButton cart={cart} data-testid="submit-order-button" />
        </>
      )}
    </section>
  )
}

export default Review
