import { createOrderShipmentWorkflow } from "@medusajs/core-flows"
import type { HttpTypes } from "@medusajs/framework/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/framework/utils"
import { assertShipmentLabelsHaveTracking } from "../../../../../../../lib/fulfillment/require-tracking"

export async function POST(
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminCreateOrderShipment,
    HttpTypes.AdminGetOrderParams
  >,
  res: MedusaResponse
) {
  const remoteQuery = req.scope.resolve(
    ContainerRegistrationKeys.REMOTE_QUERY
  )
  const variables = { id: req.params.id }

  assertShipmentLabelsHaveTracking(req.validatedBody.labels)

  const input = {
    ...req.validatedBody,
    order_id: req.params.id,
    fulfillment_id: req.params.fulfillment_id,
    labels: req.validatedBody.labels ?? [],
    created_by: req.auth_context.actor_id,
  }

  await createOrderShipmentWorkflow(req.scope).run({
    input,
  })

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "order",
    variables,
    fields: req.queryConfig.fields,
  })

  const [order] = await remoteQuery(queryObject)

  res.status(200).json({ order })
}
