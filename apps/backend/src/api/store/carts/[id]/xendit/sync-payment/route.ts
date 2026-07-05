import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
  PaymentSessionStatus,
} from "@medusajs/framework/utils"

const CART_PAYMENT_FIELDS = [
  "id",
  "payment_collection.id",
  "payment_collection.payment_sessions.id",
  "payment_collection.payment_sessions.provider_id",
  "payment_collection.payment_sessions.status",
  "payment_collection.payment_sessions.data",
]

/**
 * After Xendit redirect, sync invoice status into Medusa (authorize + capture).
 * POST /store/carts/:id/xendit/sync-payment
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const cartId = req.params.id
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const paymentModule = req.scope.resolve(Modules.PAYMENT)

  const { data: carts } = await query.graph({
    entity: "cart",
    fields: CART_PAYMENT_FIELDS,
    filters: { id: cartId },
  })

  const cart = carts[0]
  if (!cart) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "Cart not found")
  }

  const sessions = cart.payment_collection?.payment_sessions ?? []
  const xenditSession = sessions.find(
    (session) =>
      session?.provider_id?.startsWith("pp_xendit") &&
      session.status === PaymentSessionStatus.PENDING
  )

  if (!xenditSession?.id) {
    const anyXendit = sessions.find((s) => s?.provider_id?.startsWith("pp_xendit"))
    return res.json({
      synced: false,
      reason: anyXendit
        ? "payment_session_not_pending"
        : "no_xendit_payment_session",
      payment_session_status: anyXendit?.status,
    })
  }

  try {
    const payment = await paymentModule.authorizePaymentSession(xenditSession.id, {})

    return res.json({
      synced: true,
      payment_session_id: xenditSession.id,
      payment_id: payment?.id,
      captured: Boolean(payment?.captured_at),
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to sync Xendit payment"

    return res.status(400).json({
      synced: false,
      payment_session_id: xenditSession.id,
      message,
    })
  }
}
