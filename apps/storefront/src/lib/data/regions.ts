"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

const DEFAULT_COUNTRY =
  process.env.NEXT_PUBLIC_DEFAULT_REGION?.toLowerCase() || "id"

function buildCountryRegionMap(regions: HttpTypes.StoreRegion[]) {
  const map = new Map<string, HttpTypes.StoreRegion>()

  for (const region of regions) {
    for (const country of region.countries ?? []) {
      const code = country.iso_2?.toLowerCase()
      if (code) {
        map.set(code, region)
      }
    }
  }

  return map
}

export const listRegions = async () => {
  const next = {
    ...(await getCacheOptions("regions")),
  }

  return await sdk.client
    .fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
      method: "GET",
      next,
      cache: process.env.NODE_ENV === "development" ? "no-store" : "force-cache",
    })
    .then(({ regions }) => regions)
}

export const retrieveRegion = async (id: string) => {
  const next = {
    ...(await getCacheOptions(["regions", id].join("-"))),
  }

  return await sdk.client
    .fetch<{ region: HttpTypes.StoreRegion }>(`/store/regions/${id}`, {
      method: "GET",
      next,
      cache: process.env.NODE_ENV === "development" ? "no-store" : "force-cache",
    })
    .then(({ region }) => region)
    .catch(() => null)
}

export const getRegion = async (countryCode: string) => {
  const regions = await listRegions()

  if (!regions?.length) {
    return null
  }

  const regionMap = buildCountryRegionMap(regions)
  const normalizedCode = countryCode?.toLowerCase()

  return (
    (normalizedCode ? regionMap.get(normalizedCode) : null) ??
    regionMap.get(DEFAULT_COUNTRY) ??
    regions[0]
  )
}
