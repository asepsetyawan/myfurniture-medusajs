export type RajaOngkirPaymentType = "prepaid" | "cod"

export type RajaOngkirServiceCatalogEntry = {
  courier: string
  courierName: string
  service: string
  serviceLabel: string
  description: string
  supportsCod?: boolean
}

/** Layanan reguler & express — tidak termasuk trucking berat (JTR>130, dll.) */
export const RAJAONGKIR_SERVICE_CATALOG: RajaOngkirServiceCatalogEntry[] = [
  {
    courier: "jne",
    courierName: "JNE",
    service: "REG",
    serviceLabel: "Reguler",
    description: "Layanan reguler",
    supportsCod: true,
  },
  {
    courier: "jne",
    courierName: "JNE",
    service: "YES",
    serviceLabel: "YES",
    description: "Yakin esok sampai",
    supportsCod: true,
  },
  {
    courier: "jne",
    courierName: "JNE",
    service: "JTR",
    serviceLabel: "Trucking",
    description: "Kargo / barang besar",
    supportsCod: false,
  },
  {
    courier: "jnt",
    courierName: "J&T Express",
    service: "EZ",
    serviceLabel: "Reguler",
    description: "Reguler",
    supportsCod: true,
  },
  {
    courier: "sicepat",
    courierName: "SiCepat",
    service: "REG",
    serviceLabel: "Reguler",
    description: "Reguler",
    supportsCod: true,
  },
  {
    courier: "sicepat",
    courierName: "SiCepat",
    service: "BEST",
    serviceLabel: "BEST",
    description: "Besok sampai tujuan",
    supportsCod: true,
  },
  {
    courier: "sicepat",
    courierName: "SiCepat",
    service: "HALU",
    serviceLabel: "HALU",
    description: "Hari yang sama / layanan HALU",
    supportsCod: true,
  },
  {
    courier: "sicepat",
    courierName: "SiCepat",
    service: "GOKIL",
    serviceLabel: "GOKIL",
    description: "Kargo per kg (min. 10 kg)",
    supportsCod: false,
  },
  {
    courier: "anteraja",
    courierName: "AnterAja",
    service: "REG",
    serviceLabel: "Reguler",
    description: "Reguler",
    supportsCod: true,
  },
  {
    courier: "anteraja",
    courierName: "AnterAja",
    service: "SD",
    serviceLabel: "Same Day",
    description: "Same day",
    supportsCod: true,
  },
  {
    courier: "anteraja",
    courierName: "AnterAja",
    service: "ND",
    serviceLabel: "Next Day",
    description: "Next day",
    supportsCod: true,
  },
]

export const RAJAONGKIR_COURIER_CODES = [
  ...new Set(RAJAONGKIR_SERVICE_CATALOG.map((e) => e.courier)),
].join(":")

export function buildShippingOptionDefinitions() {
  const options: Array<{
    name: string
    type: { label: string; description: string; code: string }
    data: Record<string, string>
  }> = []

  for (const entry of RAJAONGKIR_SERVICE_CATALOG) {
    const baseCode = `${entry.courier}-${entry.service}`.toLowerCase()

    options.push({
      name: `${entry.courierName} · ${entry.serviceLabel}`,
      type: {
        label: entry.serviceLabel,
        description: entry.description,
        code: `${baseCode}-prepaid`,
      },
      data: {
        id: `${baseCode}-prepaid`,
        courier: entry.courier,
        service: entry.service,
        payment_type: "prepaid",
        courier_name: entry.courierName,
        service_label: entry.serviceLabel,
      },
    })

    if (entry.supportsCod !== false) {
      options.push({
        name: `${entry.courierName} · ${entry.serviceLabel} (COD)`,
        type: {
          label: `${entry.serviceLabel} (COD)`,
          description: `${entry.description} — bayar di tempat`,
          code: `${baseCode}-cod`,
        },
        data: {
          id: `${baseCode}-cod`,
          courier: entry.courier,
          service: entry.service,
          payment_type: "cod",
          courier_name: entry.courierName,
          service_label: entry.serviceLabel,
        },
      })
    }
  }

  return options
}
