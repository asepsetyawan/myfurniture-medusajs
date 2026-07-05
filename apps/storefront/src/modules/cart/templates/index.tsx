import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import { HttpTypes } from "@medusajs/types"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  return (
    <div className="bg-[#f7f4f0] py-10 small:py-14">
      <div className="content-container" data-testid="cart-container">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-semibold text-[#2d2d2d] small:text-4xl">
            Shopping cart
          </h1>
          <p className="mt-2 text-sm text-[#6b6b6b]">
            Review your items before checkout
          </p>
        </div>

        {cart?.items?.length ? (
          <div className="grid grid-cols-1 gap-8 small:grid-cols-[1fr_380px] small:gap-10">
            <div className="flex flex-col gap-6">
              {!customer && (
                <div className="rounded-lg border border-[#eee] bg-white p-6 shadow-sm">
                  <SignInPrompt />
                </div>
              )}
              <div className="rounded-lg border border-[#eee] bg-white p-6 shadow-sm small:p-8">
                <ItemsTemplate cart={cart} />
              </div>
            </div>

            <div className="relative">
              <div className="sticky top-24 flex flex-col">
                <div className="rounded-lg border border-[#eee] bg-white p-6 shadow-sm small:p-8">
                  {cart.region && <Summary cart={cart} />}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <EmptyCartMessage />
        )}
      </div>
    </div>
  )
}

export default CartTemplate
