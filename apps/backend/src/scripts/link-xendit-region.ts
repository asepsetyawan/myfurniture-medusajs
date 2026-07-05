import { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { updateRegionsWorkflow } from "@medusajs/medusa/core-flows"

/**
 * Links Xendit payment provider to the Indonesia (IDR) region.
 * Run after migrations: medusa exec ./src/scripts/link-xendit-region.ts
 */
export default async function linkXenditRegion({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code", "payment_providers.id"],
  })

  const indonesiaRegion = regions.find(
    (r) => r.currency_code === "idr"
  )

  if (!indonesiaRegion) {
    throw new Error(
      "Indonesia region not found. Run: pnpm seed:indonesia (from apps/backend)"
    )
  }

  const existingIds =
    indonesiaRegion.payment_providers
      ?.map((p) => p?.id)
      .filter((id): id is string => !!id) ?? []

  const withoutManual = existingIds.filter((id) => id !== "pp_system_default")
  const paymentProviders = withoutManual.includes("pp_xendit_xendit")
    ? withoutManual
    : [...withoutManual, "pp_xendit_xendit"]

  const unchanged =
    paymentProviders.length === existingIds.length &&
    existingIds.includes("pp_xendit_xendit") &&
    !existingIds.includes("pp_system_default")

  if (unchanged) {
    logger.info("Indonesia region already uses Xendit (manual payment removed).")
    return
  }

  await updateRegionsWorkflow(container).run({
    input: {
      selector: { id: indonesiaRegion.id },
      update: { payment_providers: paymentProviders },
    },
  })

  logger.info(
    "Indonesia region updated: Xendit linked, manual payment removed if present."
  )
}
