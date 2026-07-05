import { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

import { syncVariantInventory } from "./lib/sync-variant-inventory"

export default async function syncInventory({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  logger.info("Syncing variant inventory for storefront...")
  await syncVariantInventory(container)
  logger.info("Inventory sync completed.")
}
