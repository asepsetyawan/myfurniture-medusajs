export const WISHLIST_STORAGE_KEY = "myfurniture_wishlist"

export type WishlistItem = {
  id: string
  handle: string
  title: string
  thumbnail: string | null
}

export function readWishlist(): WishlistItem[] {
  if (typeof window === "undefined") {
    return []
  }

  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY)
    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter(
      (item): item is WishlistItem =>
        !!item &&
        typeof item === "object" &&
        typeof (item as WishlistItem).id === "string" &&
        typeof (item as WishlistItem).handle === "string" &&
        typeof (item as WishlistItem).title === "string"
    )
  } catch {
    return []
  }
}

export function writeWishlist(items: WishlistItem[]) {
  if (typeof window === "undefined") {
    return
  }

  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items))
}

export function isInWishlist(id: string, items: WishlistItem[]) {
  return items.some((item) => item.id === id)
}
