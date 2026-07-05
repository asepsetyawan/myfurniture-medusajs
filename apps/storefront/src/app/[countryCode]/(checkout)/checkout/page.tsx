import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Checkout | myfurniture",
}

export default async function Checkout() {
  const cart = await retrieveCart()

  if (!cart) {
    return notFound()
  }

  const customer = await retrieveCustomer()

  return (
    <div className="content-container py-10 small:py-14">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-[#2d2d2d] small:text-4xl">
          Checkout
        </h1>
        <p className="mt-2 text-sm text-[#6b6b6b]">
          Complete your order in a few simple steps
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 small:grid-cols-[1fr_400px]">
        <PaymentWrapper cart={cart}>
          <CheckoutForm cart={cart} customer={customer} />
        </PaymentWrapper>
        <CheckoutSummary cart={cart} />
      </div>
    </div>
  )
}
