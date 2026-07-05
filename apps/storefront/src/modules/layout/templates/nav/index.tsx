import { listCategories } from "@lib/data/categories"
import { retrieveCustomer } from "@lib/data/customer"
import { listRegions } from "@lib/data/regions"

import WoodmartHeader from "./woodmart-header"

export default async function Nav() {
  const [categories, regions, customer] = await Promise.all([
    listCategories(),
    listRegions(),
    retrieveCustomer(),
  ])

  return (
    <WoodmartHeader
      categories={categories}
      regions={regions ?? []}
      customer={customer}
    />
  )
}
