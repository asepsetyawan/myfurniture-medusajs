"use client"

import { ReactNode } from "react"

import { WishlistProvider } from "@lib/wishlist/wishlist-context"

export default function ClientProviders({ children }: { children: ReactNode }) {
  return <WishlistProvider>{children}</WishlistProvider>
}
