import { HttpTypes } from "@medusajs/types"

import { getProductPrice } from "@lib/util/get-product-price"
import {
  getCategoryIcon,
  getCategoryMetadata,
  sortActiveCategories,
} from "@lib/woodmart/category-metadata"

export type WoodmartProductBadge = "new" | "hot" | "sale"

export type WoodmartProductCardData = {
  id: string
  handle: string
  title: string
  thumbnail: string | null
  categoryLabel: string
  categoryHandles: string[]
  price: string
  originalPrice?: string
  salePercent?: number
  rating?: number
  badge?: WoodmartProductBadge
  swatches?: string[]
}

function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash + value.charCodeAt(i) * (i + 1)) % 997
  }
  return hash
}

export function getProductRating(product: HttpTypes.StoreProduct): number {
  const metadata = product.metadata as { rating?: number | string } | null
  const parsed = Number(metadata?.rating)
  if (!Number.isNaN(parsed) && parsed > 0) {
    return Math.min(5, Math.max(1, parsed))
  }

  const handle = product.handle ?? product.id ?? ""
  return Math.round((4 + (hashString(handle) % 11) / 10) * 10) / 10
}

export function getProductBadge(
  product: HttpTypes.StoreProduct,
  salePercent?: number
): WoodmartProductBadge | undefined {
  const metadata = product.metadata as { badge?: string } | null
  if (metadata?.badge === "new" || metadata?.badge === "hot") {
    return metadata.badge
  }

  if (salePercent && salePercent > 0) {
    return "sale"
  }

  if (product.created_at) {
    const daysSince =
      (Date.now() - new Date(product.created_at).getTime()) / (1000 * 60 * 60 * 24)
    if (daysSince < 45) {
      return "new"
    }
  }

  const handle = product.handle ?? ""
  if (hashString(handle) % 5 === 0) {
    return "hot"
  }

  return undefined
}

export type WoodmartHeroSlideData = {
  id: string
  image: string
  authorImage: string
  authorName: string
  category: string
  categoryHref: string
  title: string
  price: string
  cta: string
  ctaHref: string
}

const BESTSELLER_TAB_HANDLES = ["chairs", "sofas", "armchairs", "tables"] as const

export function getCategoryImage(
  category: HttpTypes.StoreProductCategory
): string {
  const { image } = getCategoryMetadata(category)
  if (image) {
    return image
  }

  if (category.handle) {
    return `/images/woodmart/categories/${category.handle}.jpg`
  }

  return "/images/woodmart/categories/chairs.jpg"
}

export { getCategoryIcon, sortActiveCategories }

export function getCategoryHref(handle: string): string {
  return `/categories/${handle}`
}

export function getPrimaryCategory(
  product: HttpTypes.StoreProduct
): HttpTypes.StoreProductCategory | undefined {
  return product.categories?.[0]
}

export function mapProductToCardData(
  product: HttpTypes.StoreProduct
): WoodmartProductCardData | null {
  const { cheapestPrice } = getProductPrice({ product })

  if (!cheapestPrice) {
    return null
  }

  const primaryCategory = getPrimaryCategory(product)
  const salePercent =
    cheapestPrice.price_type === "sale" && cheapestPrice.percentage_diff
      ? parseInt(cheapestPrice.percentage_diff, 10)
      : undefined

  const badge = getProductBadge(
    product,
    salePercent && !Number.isNaN(salePercent) ? salePercent : undefined
  )

  const metadata = product.metadata as { swatches?: string[] } | null
  const swatches = Array.isArray(metadata?.swatches)
    ? metadata.swatches.filter((c) => typeof c === "string")
    : undefined

  return {
    id: product.id!,
    handle: product.handle!,
    title: product.title!,
    thumbnail: product.thumbnail ?? product.images?.[0]?.url ?? null,
    categoryLabel: primaryCategory?.name ?? "",
    categoryHandles:
      product.categories?.map((c) => c.handle!).filter(Boolean) ?? [],
    price: cheapestPrice.calculated_price,
    originalPrice:
      cheapestPrice.price_type === "sale"
        ? cheapestPrice.original_price
        : undefined,
    salePercent: salePercent && !Number.isNaN(salePercent) ? salePercent : undefined,
    rating: getProductRating(product),
    badge,
    swatches,
  }
}

export function buildBestsellerTabs(
  categories: HttpTypes.StoreProductCategory[]
): { id: string; label: string }[] {
  const sorted = sortActiveCategories(categories)
  const tabs: { id: string; label: string }[] = [{ id: "all", label: "All" }]

  const preferred = BESTSELLER_TAB_HANDLES.map((handle) =>
    sorted.find((category) => category.handle === handle)
  ).filter((category): category is HttpTypes.StoreProductCategory => !!category)

  const tabCategories =
    preferred.length > 0 ? preferred : sorted.slice(0, 4)

  for (const category of tabCategories) {
    tabs.push({
      id: category.handle!,
      label: category.name,
    })
  }

  return tabs
}

const HERO_PRODUCT_HANDLES = ["mags", "belt", "terracotta-vase"] as const

const HERO_VISUALS: Record<
  (typeof HERO_PRODUCT_HANDLES)[number],
  { image: string; authorImage: string; authorName: string; titlePrefix: string }
> = {
  mags: {
    image: "/images/woodmart/hero/slider-1.jpg",
    authorImage: "/images/woodmart/authors/author-1.png",
    authorName: "Ramón Esteve",
    titlePrefix: "Sectional fabric sofa by",
  },
  belt: {
    image: "/images/woodmart/hero/slider-2.jpg",
    authorImage: "/images/woodmart/authors/author-2.png",
    authorName: "Ethimo Design",
    titlePrefix: "Modern armchair collection by",
  },
  "terracotta-vase": {
    image: "/images/woodmart/hero/slider-3.jpg",
    authorImage: "/images/woodmart/authors/author-3.png",
    authorName: "Valencia Studio",
    titlePrefix: "Terracotta vase by",
  },
}

export function buildHeroSlides(
  products: HttpTypes.StoreProduct[]
): WoodmartHeroSlideData[] {
  return HERO_PRODUCT_HANDLES.flatMap((handle) => {
    const product = products.find((p) => p.handle === handle)
    const visual = HERO_VISUALS[handle]
    if (!product) {
      return []
    }

    const { cheapestPrice } = getProductPrice({ product })
    const category = getPrimaryCategory(product)

    return [
      {
        id: product.id!,
        image: visual.image,
        authorImage: visual.authorImage,
        authorName: visual.authorName,
        category: category?.name?.toLowerCase() ?? "decor",
        categoryHref: category?.handle
          ? getCategoryHref(category.handle)
          : "/store",
        title: visual.titlePrefix,
        price: cheapestPrice?.calculated_price ?? "",
        cta: "Shop Now",
        ctaHref: `/products/${product.handle}`,
      },
    ]
  })
}

export function splitCategoriesForFooter(
  categories: HttpTypes.StoreProductCategory[]
): [{ label: string; href: string }[], { label: string; href: string }[]] {
  const links = sortActiveCategories(categories).map((c) => ({
      label: c.name,
      href: getCategoryHref(c.handle!),
    }))

  const midpoint = Math.ceil(links.length / 2)
  return [links.slice(0, midpoint), links.slice(midpoint)]
}
