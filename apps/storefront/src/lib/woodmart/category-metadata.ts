import { HttpTypes } from "@medusajs/types"

export type CategoryMetadata = {
  image?: string
  icon?: string
}

export function getCategoryMetadata(
  category: HttpTypes.StoreProductCategory
): CategoryMetadata {
  const metadata = category.metadata as CategoryMetadata | null | undefined
  return {
    image:
      typeof metadata?.image === "string" ? metadata.image : undefined,
    icon: typeof metadata?.icon === "string" ? metadata.icon : undefined,
  }
}

export function getCategoryIcon(
  category: HttpTypes.StoreProductCategory
): string {
  const { icon } = getCategoryMetadata(category)
  if (icon) {
    return icon
  }

  return category.handle ?? "chair"
}

export function sortActiveCategories(
  categories: HttpTypes.StoreProductCategory[]
): HttpTypes.StoreProductCategory[] {
  return [...categories]
    .filter((category) => category.handle && category.is_active !== false)
    .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
}
