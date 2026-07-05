"use server"

import { isManual } from "@lib/constants"
import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { HttpTypes } from "@medusajs/types"

export const listCartPaymentMethods = async (regionId: string) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("payment_providers")),
  }

  return sdk.client
    .fetch<HttpTypes.StorePaymentProviderListResponse>(
      `/store/payment-providers`,
      {
        method: "GET",
        query: { region_id: regionId },
        headers,
        next,
        cache: "force-cache",
      }
    )
    .then(({ payment_providers }) =>
      payment_providers
        .filter((provider) => !isManual(provider.id))
        .sort((a, b) => {
        const aIsXendit = a.id.startsWith("pp_xendit")
        const bIsXendit = b.id.startsWith("pp_xendit")
        if (aIsXendit && !bIsXendit) return -1
        if (!aIsXendit && bIsXendit) return 1
        return a.id > b.id ? 1 : -1
      })
    )
    .catch(() => {
      return null
    })
}
