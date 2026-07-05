import { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { deleteShippingOptionsWorkflow } from "@medusajs/medusa/core-flows"

const LEGACY_SHIPPING_NAMES = ["Standard Shipping", "Express Shipping"]

export default async function removeLegacyShipping({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: shippingOptions } = await query.graph({
    entity: "shipping_option",
    fields: ["id", "name"],
  })

  const legacyIds = shippingOptions
    .filter((o) => o.name && LEGACY_SHIPPING_NAMES.includes(o.name))
    .map((o) => o.id)

  if (!legacyIds.length) {
    logger.info("No Standard/Express shipping options to remove.")
    return
  }

  await deleteShippingOptionsWorkflow(container).run({
    input: { ids: legacyIds },
  })

  logger.info(
    `Removed ${legacyIds.length} legacy shipping option(s): ${LEGACY_SHIPPING_NAMES.join(", ")}.`
  )
}
