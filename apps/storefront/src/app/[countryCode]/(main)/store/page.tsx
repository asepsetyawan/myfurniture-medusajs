import { Metadata } from "next"

import { CategorySortOption } from "@modules/categories/components/category-toolbar"
import StoreTemplate from "@modules/store/templates"

export const metadata: Metadata = {
  title: "Store",
  description: "Explore all of our products.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: CategorySortOption
    page?: string
    limit?: string
    q?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { sortBy, page, limit, q } = searchParams

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      limit={limit}
      q={q}
      countryCode={params.countryCode}
    />
  )
}
