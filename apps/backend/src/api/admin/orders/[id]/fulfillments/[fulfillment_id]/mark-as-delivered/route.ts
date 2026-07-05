import {
  markOrderFulfillmentAsDeliveredWorkflow,
} from "@medusajs/core-flows"
import type { HttpTypes } from "@medusajs/framework/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
  refetchEntity,
} from "@medusajs/framework/http"
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"
import { assertFulfillmentHasTrackingBeforeDelivery } from "../../../../../../../lib/fulfillment/require-tracking"

export async function POST(
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminMarkOrderFulfillmentAsDelivered,
    HttpTypes.AdminGetOrderParams
  >,
  res: MedusaResponse
) {
  const { id: orderId, fulfillment_id: fulfillmentId } = req.params

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: fulfillments } = await query.graph({
    entity: "fulfillment",
    fields: [
      "id",
      "requires_shipping",
      "shipped_at",
      "labels.tracking_number",
      "shipping_option.service_zone.fulfillment_set.type",
    ],
    filters: { id: fulfillmentId },
  })

  const fulfillment = fulfillments?.[0]

  if (!fulfillment) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Fulfillment with id ${fulfillmentId} was not found`
    )
  }

  assertFulfillmentHasTrackingBeforeDelivery(fulfillment)

  await markOrderFulfillmentAsDeliveredWorkflow(req.scope).run({
    input: {
      orderId,
      fulfillmentId,
      no_notification: req.validatedBody.no_notification,
    },
  })

  const order = await refetchEntity({
    entity: "order",
    idOrFilter: orderId,
    scope: req.scope,
    fields: req.queryConfig.fields,
  })

  res.status(200).json({ order })
}
