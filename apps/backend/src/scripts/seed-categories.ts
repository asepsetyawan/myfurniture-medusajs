import { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

import { replaceFurnitureCategories } from "./lib/replace-furniture-categories"

export default async function seedCategories({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  await replaceFurnitureCategories(container, { deleteProducts: true })

  logger.info(
    "Category seed completed. Run `pnpm seed:myfurniture` (or seed:woodmart) to restore products."
  )
}
