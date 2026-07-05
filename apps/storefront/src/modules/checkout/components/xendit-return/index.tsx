"use client"

import { getStoredCartId, placeOrder } from "@lib/data/cart"
import { syncXenditPaymentForCart } from "@lib/data/xendit"
import { Button, Heading, Text } from "@modules/common/components/ui"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function XenditReturn() {
  const router = useRouter()
  const { countryCode } = useParams<{ countryCode: string }>()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const complete = async () => {
      const cartId = await getStoredCartId()

      if (cartId) {
        let lastMessage: string | undefined

        for (let attempt = 0; attempt < 8; attempt++) {
          const result = await syncXenditPaymentForCart(cartId)

          if (result.synced) {
            await placeOrder()
            return
          }

          lastMessage = result.message

          if (result.reason === "payment_session_not_pending") {
            break
          }

          await new Promise((resolve) => setTimeout(resolve, 1500))
        }

        try {
          await placeOrder()
          return
        } catch {
          // fall through to error below
        }

        throw new Error(
          lastMessage ||
            "Payment verification failed. Please contact support if you were charged."
        )
      }

      await placeOrder()
    }

    complete().catch((err) => {
      setError(
        err instanceof Error
          ? err.message
          : "Payment verification failed. Please contact support if you were charged."
      )
    })
  }, [])

  if (error) {
    return (
      <div className="content-container py-24 max-w-lg mx-auto text-center">
        <Heading level="h1" className="text-2xl mb-4">
          Payment issue
        </Heading>
        <Text className="text-ui-fg-subtle mb-8">{error}</Text>
        <Button
          onClick={() =>
            router.push(`/${countryCode}/checkout?step=payment`)
          }
        >
          Back to checkout
        </Button>
      </div>
    )
  }

  return (
    <div className="content-container py-24 max-w-lg mx-auto text-center">
      <Heading level="h1" className="text-2xl mb-4">
        Confirming your payment…
      </Heading>
      <Text className="text-ui-fg-subtle">
        Please wait while we verify your payment with Xendit.
      </Text>
    </div>
  )
}
