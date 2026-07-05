import { Metadata } from "next"

import { listCategories } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { buildHeroSlides } from "@lib/woodmart/catalog-helpers"
import BrandsSection from "@modules/home/components/brands-section"
import CategoriesSection from "@modules/home/components/categories-section"
import WoodmartHero from "@modules/home/components/hero/woodmart-hero"
import FurnitureRulesSection from "@modules/home/components/furniture-rules-section"
import LatestArticlesSection from "@modules/home/components/latest-articles-section"
import ProductCollectionsSection from "@modules/home/components/product-collections-section"
import WeeklyBestsellers from "@modules/home/components/weekly-bestsellers"

export const metadata: Metadata = {
  title: "myfurniture – Furniture Store",
  description: "Modern furniture for every room. Chairs, sofas, tables and more.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const [categories, heroProductsResult] = await Promise.all([
    listCategories(),
    listProducts({
      countryCode,
      queryParams: {
        limit: 100,
        fields: "*variants.calculated_price,*categories",
      },
    }),
  ])

  const heroSlides = buildHeroSlides(heroProductsResult.response.products)

  return (
    <>
      <WoodmartHero slides={heroSlides} />
      <CategoriesSection categories={categories} />
      <WeeklyBestsellers countryCode={countryCode} categories={categories} />
      <BrandsSection />
      <ProductCollectionsSection countryCode={countryCode} />
      <FurnitureRulesSection />
      <LatestArticlesSection />
    </>
  )
}
