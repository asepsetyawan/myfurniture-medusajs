import { Metadata } from "next"

import WishlistTemplate from "@modules/wishlist/templates"

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Your saved products.",
}

type Params = {
  params: Promise<{
    countryCode: string
  }>
}

export default async function WishlistPage(_props: Params) {
  return <WishlistTemplate />
}
