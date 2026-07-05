import { listCategories } from "@lib/data/categories"

import WoodmartFooter from "./woodmart-footer"

export default async function Footer() {
  const categories = await listCategories()

  return <WoodmartFooter categories={categories} />
}
