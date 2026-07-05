import { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { updateRegionsWorkflow } from "@medusajs/medusa/core-flows"

const MANUAL_PROVIDER_ID = "pp_system_default"

/**
 * Unlinks manual payment from all regions.
 * Run: pnpm payment:remove-manual (from apps/backend)
 */
export default async function removeManualPayment({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "payment_providers.id"],
  })

  let updated = 0

  for (const region of regions) {
    const existingIds =
      region.payment_providers
        ?.map((p) => p?.id)
        .filter((id): id is string => !!id) ?? []

    if (!existingIds.includes(MANUAL_PROVIDER_ID)) {
      continue
    }

    const paymentProviders = existingIds.filter(
      (id) => id !== MANUAL_PROVIDER_ID
    )

    if (paymentProviders.length === 0) {
      logger.warn(
        `Region "${region.name}" (${region.id}) has no providers left after removing manual. Skipping.`
      )
      continue
    }

    await updateRegionsWorkflow(container).run({
      input: {
        selector: { id: region.id },
        update: { payment_providers: paymentProviders },
      },
    })

    updated++
    logger.info(`Removed manual payment from region "${region.name}".`)
  }

  if (updated === 0) {
    logger.info("No regions had manual payment linked.")
  } else {
    logger.info(`Updated ${updated} region(s).`)
  }
}
