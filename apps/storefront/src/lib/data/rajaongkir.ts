"use server"

import { sdk } from "@lib/config"

export type RajaOngkirDestination = {
  id: number
  label: string
  province_name: string
  city_name: string
  district_name: string
  subdistrict_name: string
  zip_code: string
}

export type RajaOngkirShippingQuote = {
  shipping_option_id: string
  available: boolean
  courier?: string
  service?: string
  payment_type?: string
  amount?: number
  etd?: string
  description?: string
  courier_name?: string
}

export async function fetchRajaOngkirShippingQuotes(
  cartId: string
): Promise<RajaOngkirShippingQuote[]> {
  return sdk.client
    .fetch<{ quotes: RajaOngkirShippingQuote[] }>(
      `/store/carts/${cartId}/rajaongkir-shipping-quotes`,
      { method: "GET", cache: "no-store" }
    )
    .then(({ quotes }) => quotes ?? [])
    .catch(() => [])
}

export async function searchRajaOngkirDestinations(
  search: string
): Promise<RajaOngkirDestination[]> {
  if (!search || search.trim().length < 2) {
    return []
  }

  return sdk.client
    .fetch<{ destinations: RajaOngkirDestination[] }>(
      "/store/rajaongkir/destinations",
      {
        method: "GET",
        query: { search: search.trim(), limit: 10 },
        cache: "no-store",
      }
    )
    .then(({ destinations }) => destinations ?? [])
    .catch(() => [])
}
