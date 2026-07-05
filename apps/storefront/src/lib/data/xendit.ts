"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheOptions, getCacheTag } from "./cookies"
import { revalidateTag } from "next/cache"

export async function syncXenditPaymentForCart(cartId: string) {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("carts")),
  }

  const result = await sdk.client.fetch<{
    synced: boolean
    message?: string
    captured?: boolean
    reason?: string
  }>(`/store/carts/${cartId}/xendit/sync-payment`, {
    method: "POST",
    headers,
    next,
    cache: "no-store",
  })

  const cartCacheTag = await getCacheTag("carts")
  revalidateTag(cartCacheTag)

  return result
}
