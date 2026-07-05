import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { RajaOngkirClient } from "../../../../modules/fulfillment-rajaongkir/client"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const apiKey = process.env.RAJAONGKIR_API_KEY

  if (!apiKey) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "RajaOngkir API key is not configured"
    )
  }

  const search =
    typeof req.query.search === "string" ? req.query.search.trim() : ""

  if (search.length < 2) {
    return res.json({ destinations: [] })
  }

  const limit =
    typeof req.query.limit === "string" ? Number(req.query.limit) : 10

  const client = new RajaOngkirClient(apiKey)
  const destinations = await client.searchDomesticDestinations(
    search,
    Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 25) : 10
  )

  res.json({ destinations })
}
