"use client"

import { setAddresses } from "@lib/data/cart"
import useToggleState from "@lib/hooks/use-toggle-state"
import compareAddresses from "@lib/util/compare-addresses"
import { CheckCircleSolid } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import WoodmartPanel from "@modules/common/components/woodmart-panel"
import Spinner from "@modules/common/icons/spinner"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useActionState } from "react"

import BillingAddress from "../billing_address"
import ErrorMessage from "../error-message"
import ShippingAddress from "../shipping-address"
import { SubmitButton } from "../submit-button"

const summaryText = "text-sm text-[#666]"
const summaryLabel = "mb-1 text-sm font-semibold text-[#2d2d2d]"

const Addresses = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "address"

  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  )

  const handleEdit = () => {
    router.push(pathname + "?step=address")
  }

  const [message, formAction] = useActionState(setAddresses, null)

  return (
    <WoodmartPanel
      title="Shipping address"
      action={
        !isOpen && cart?.shipping_address ? (
          <button
            type="button"
            onClick={handleEdit}
            className="text-sm font-medium text-[#e67e22] hover:underline"
            data-testid="edit-address-button"
          >
            Edit
          </button>
        ) : !isOpen ? (
          <CheckCircleSolid className="text-[#27ae60]" />
        ) : undefined
      }
    >
      {isOpen ? (
        <form action={formAction}>
          <ShippingAddress
            customer={customer}
            checked={sameAsBilling}
            onChange={toggleSameAsBilling}
            cart={cart}
          />

          {!sameAsBilling && (
            <div className="pt-8">
              <h3 className="mb-6 font-display text-lg font-semibold text-[#2d2d2d]">
                Billing address
              </h3>
              <BillingAddress cart={cart} />
            </div>
          )}
          <SubmitButton className="mt-6" data-testid="submit-address-button">
            Continue to delivery
          </SubmitButton>
          <ErrorMessage error={message} data-testid="address-error-message" />
        </form>
      ) : cart?.shipping_address ? (
        <div className="grid grid-cols-1 gap-6 small:grid-cols-3">
          <div data-testid="shipping-address-summary">
            <p className={summaryLabel}>Shipping address</p>
            <p className={summaryText}>
              {cart.shipping_address.first_name}{" "}
              {cart.shipping_address.last_name}
            </p>
            <p className={summaryText}>
              {cart.shipping_address.address_1}{" "}
              {cart.shipping_address.address_2}
            </p>
            <p className={summaryText}>
              {cart.shipping_address.postal_code}, {cart.shipping_address.city}
            </p>
            {(
              cart.shipping_address.metadata as
                | Record<string, unknown>
                | undefined
            )?.rajaongkir_destination_label ? (
              <p className={summaryText}>
                {String(
                  (
                    cart.shipping_address.metadata as Record<string, unknown>
                  ).rajaongkir_destination_label
                )}
              </p>
            ) : null}
            <p className={summaryText}>
              {cart.shipping_address.country_code?.toUpperCase()}
            </p>
          </div>

          <div data-testid="shipping-contact-summary">
            <p className={summaryLabel}>Contact</p>
            <p className={summaryText}>{cart.shipping_address.phone}</p>
            <p className={summaryText}>{cart.email}</p>
          </div>

          <div data-testid="billing-address-summary">
            <p className={summaryLabel}>Billing address</p>
            {sameAsBilling ? (
              <p className={summaryText}>
                Same as shipping address
              </p>
            ) : (
              <>
                <p className={summaryText}>
                  {cart.billing_address?.first_name}{" "}
                  {cart.billing_address?.last_name}
                </p>
                <p className={summaryText}>
                  {cart.billing_address?.address_1}{" "}
                  {cart.billing_address?.address_2}
                </p>
                <p className={summaryText}>
                  {cart.billing_address?.postal_code},{" "}
                  {cart.billing_address?.city}
                </p>
              </>
            )}
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </WoodmartPanel>
  )
}

export default Addresses
