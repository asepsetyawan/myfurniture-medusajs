import { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import {
  createInventoryLevelsWorkflow,
  updateInventoryLevelsWorkflow,
} from "@medusajs/medusa/core-flows"

const DEFAULT_STOCKED_QUANTITY = 100

/**
 * Resolves the stock location used for storefront availability.
 * Prefers Indonesia warehouse; falls back to the first configured location.
 */
export async function resolveStoreStockLocation(container: MedusaContainer) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id", "name"],
  })

  if (!stockLocations.length) {
    return null
  }

  const indonesiaLocation = stockLocations.find((location) =>
    location.name?.toLowerCase().includes("indonesia")
  )

  return indonesiaLocation ?? stockLocations[0]
}

/**
 * Ensures every inventory item has stocked quantity at the storefront stock location.
 */
export async function syncVariantInventory(
  container: MedusaContainer,
  options?: { stockedQuantity?: number }
) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const stockedQuantity = options?.stockedQuantity ?? DEFAULT_STOCKED_QUANTITY

  const stockLocation = await resolveStoreStockLocation(container)

  if (!stockLocation) {
    logger.warn("No stock location found. Skipping inventory sync.")
    return
  }

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  })

  if (!inventoryItems.length) {
    logger.info("No inventory items to sync.")
    return
  }

  const { data: existingLevels } = await query.graph({
    entity: "inventory_level",
    fields: ["id", "inventory_item_id", "location_id", "stocked_quantity"],
  })

  const levelsToCreate: {
    location_id: string
    inventory_item_id: string
    stocked_quantity: number
  }[] = []

  const levelsToUpdate: {
    id: string
    inventory_item_id: string
    location_id: string
    stocked_quantity: number
  }[] = []

  for (const item of inventoryItems) {
    const level = existingLevels.find(
      (existing) =>
        existing.inventory_item_id === item.id &&
        existing.location_id === stockLocation.id
    )

    if (!level) {
      levelsToCreate.push({
        location_id: stockLocation.id,
        inventory_item_id: item.id,
        stocked_quantity: stockedQuantity,
      })
      continue
    }

    if ((level.stocked_quantity ?? 0) < stockedQuantity) {
      levelsToUpdate.push({
        id: level.id,
        inventory_item_id: item.id,
        location_id: stockLocation.id,
        stocked_quantity: stockedQuantity,
      })
    }
  }

  if (levelsToCreate.length) {
    await createInventoryLevelsWorkflow(container).run({
      input: { inventory_levels: levelsToCreate },
    })
    logger.info(
      `Created ${levelsToCreate.length} inventory level(s) at ${stockLocation.name}.`
    )
  }

  if (levelsToUpdate.length) {
    await updateInventoryLevelsWorkflow(container).run({
      input: { updates: levelsToUpdate },
    })
    logger.info(
      `Updated ${levelsToUpdate.length} inventory level(s) at ${stockLocation.name}.`
    )
  }

  if (!levelsToCreate.length && !levelsToUpdate.length) {
    logger.info(
      `Inventory already synced at ${stockLocation.name} (${stockedQuantity} units per item).`
    )
  }
}
