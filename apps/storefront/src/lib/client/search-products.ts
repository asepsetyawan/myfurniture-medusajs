import { HttpTypes } from "@medusajs/types"

const backendUrl =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000"

export async function searchProductSuggestions({
  q,
  regionId,
  limit = 6,
}: {
  q: string
  regionId: string
  limit?: number
}): Promise<HttpTypes.StoreProduct[]> {
  const query = new URLSearchParams({
    q,
    limit: String(limit),
    region_id: regionId,
    fields: "id,title,handle,thumbnail",
  })

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
  if (publishableKey) {
    headers["x-publishable-api-key"] = publishableKey
  }

  const res = await fetch(`${backendUrl}/store/products?${query}`, {
    headers,
    cache: "no-store",
  })

  if (!res.ok) {
    return []
  }

  const data = (await res.json()) as {
    products?: HttpTypes.StoreProduct[]
  }

  return data.products ?? []
}
