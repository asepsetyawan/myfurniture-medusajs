"use client"

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

import { WoodmartProductCardData } from "@lib/woodmart/catalog-helpers"

import {
  WISHLIST_STORAGE_KEY,
  WishlistItem,
  isInWishlist,
  readWishlist,
  writeWishlist,
} from "./storage"

type WishlistContextValue = {
  items: WishlistItem[]
  count: number
  isWishlisted: (productId: string) => boolean
  toggleWishlist: (product: WoodmartProductCardData) => void
  removeFromWishlist: (productId: string) => void
  clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextValue | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])

  useEffect(() => {
    setItems(readWishlist())

    const onStorage = (event: StorageEvent) => {
      if (event.key === WISHLIST_STORAGE_KEY) {
        setItems(readWishlist())
      }
    }

    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const persist = useCallback((next: WishlistItem[]) => {
    setItems(next)
    writeWishlist(next)
  }, [])

  const toggleWishlist = useCallback(
    (product: WoodmartProductCardData) => {
      setItems((current) => {
        const exists = isInWishlist(product.id, current)
        const next = exists
          ? current.filter((item) => item.id !== product.id)
          : [
              {
                id: product.id,
                handle: product.handle,
                title: product.title,
                thumbnail: product.thumbnail,
              },
              ...current,
            ]
        writeWishlist(next)
        return next
      })
    },
    []
  )

  const removeFromWishlist = useCallback((productId: string) => {
    setItems((current) => {
      const next = current.filter((item) => item.id !== productId)
      writeWishlist(next)
      return next
    })
  }, [])

  const clearWishlist = useCallback(() => {
    persist([])
  }, [persist])

  const value = useMemo<WishlistContextValue>(
    () => ({
      items,
      count: items.length,
      isWishlisted: (productId) => isInWishlist(productId, items),
      toggleWishlist,
      removeFromWishlist,
      clearWishlist,
    }),
    [items, toggleWishlist, removeFromWishlist, clearWishlist]
  )

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider")
  }
  return context
}
