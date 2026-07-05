import { MedusaError } from "@medusajs/framework/utils"

export type FulfillmentForTrackingCheck = {
  requires_shipping?: boolean | null
  shipped_at?: string | Date | null
  labels?: Array<{ tracking_number?: string | null }> | null
  shipping_option?: {
    service_zone?: {
      fulfillment_set?: { type?: string | null } | null
    } | null
  } | null
}

const PICKUP_FULFILLMENT_SET_TYPE = "pickup"

export function isPickupFulfillment(
  fulfillment: FulfillmentForTrackingCheck
): boolean {
  return (
    fulfillment.shipping_option?.service_zone?.fulfillment_set?.type ===
    PICKUP_FULFILLMENT_SET_TYPE
  )
}

export function fulfillmentRequiresTrackingNumber(
  fulfillment: FulfillmentForTrackingCheck
): boolean {
  if (!fulfillment.requires_shipping) {
    return false
  }

  return !isPickupFulfillment(fulfillment)
}

export function hasValidTrackingNumber(
  fulfillment: FulfillmentForTrackingCheck
): boolean {
  return (fulfillment.labels ?? []).some((label) =>
    Boolean(label.tracking_number?.trim())
  )
}

export function assertShipmentLabelsHaveTracking(
  labels: Array<{ tracking_number?: string | null }> | undefined | null
): void {
  const hasTracking = (labels ?? []).some((label) =>
    Boolean(label.tracking_number?.trim())
  )

  if (!hasTracking) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Nomor resi wajib diisi saat menandai pengiriman."
    )
  }
}

export function assertFulfillmentHasTrackingBeforeDelivery(
  fulfillment: FulfillmentForTrackingCheck
): void {
  if (!fulfillmentRequiresTrackingNumber(fulfillment)) {
    return
  }

  if (!fulfillment.shipped_at) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Tandai sebagai dikirim dan isi nomor resi terlebih dahulu sebelum menandai pesanan sebagai terkirim."
    )
  }

  if (!hasValidTrackingNumber(fulfillment)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Nomor resi wajib diisi sebelum menandai pesanan sebagai terkirim."
    )
  }
}
