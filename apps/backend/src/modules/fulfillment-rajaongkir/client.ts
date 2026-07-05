const RAJAONGKIR_BASE_URL = "https://rajaongkir.komerce.id/api/v1"

export type RajaOngkirDestination = {
  id: number
  label: string
  province_name: string
  city_name: string
  district_name: string
  subdistrict_name: string
  zip_code: string
}

export type RajaOngkirShippingRate = {
  name: string
  code: string
  service: string
  description: string
  cost: number
  etd: string
}

type RajaOngkirResponse<T> = {
  meta: {
    message: string
    code: number
    status: string
  }
  data: T
}

export class RajaOngkirClient {
  constructor(private readonly apiKey: string) {}

  private async request<T>(
    path: string,
    params?: Record<string, string>
  ): Promise<T> {
    const url = new URL(`${RAJAONGKIR_BASE_URL}${path}`)
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, value)
      }
    }

    const response = await fetch(url.toString(), {
      headers: {
        key: this.apiKey,
      },
    })

    const body = (await response.json()) as RajaOngkirResponse<T>

    if (!response.ok || body.meta?.status !== "success") {
      throw new Error(
        body.meta?.message || `RajaOngkir API error (${response.status})`
      )
    }

    return body.data
  }

  async searchDomesticDestinations(
    search: string,
    limit = 10
  ): Promise<RajaOngkirDestination[]> {
    if (!search.trim()) {
      return []
    }

    return this.request<RajaOngkirDestination[]>(
      "/destination/domestic-destination",
      {
        search: search.trim(),
        limit: String(limit),
        offset: "0",
      }
    )
  }

  async calculateDomesticCost(params: {
    origin: string
    destination: string
    weight: number
    courier: string
  }): Promise<RajaOngkirShippingRate[]> {
    const body = new URLSearchParams({
      origin: params.origin,
      destination: params.destination,
      weight: String(params.weight),
      courier: params.courier,
    })

    const response = await fetch(
      `${RAJAONGKIR_BASE_URL}/calculate/domestic-cost`,
      {
        method: "POST",
        headers: {
          key: this.apiKey,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      }
    )

    const result = (await response.json()) as RajaOngkirResponse<
      RajaOngkirShippingRate[]
    >

    if (!response.ok || result.meta?.status !== "success") {
      throw new Error(
        result.meta?.message ||
          `RajaOngkir cost calculation failed (${response.status})`
      )
    }

    return result.data ?? []
  }
}
