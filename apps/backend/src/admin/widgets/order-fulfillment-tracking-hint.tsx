import { defineWidgetConfig } from "@medusajs/admin-sdk"
import type { AdminOrder } from "@medusajs/types"
import type { DetailWidgetProps } from "@medusajs/types"
import { InformationCircleSolid } from "@medusajs/icons"
import { Container, Text } from "@medusajs/ui"

function fulfillmentNeedsResi(
  fulfillment: NonNullable<AdminOrder["fulfillments"]>[number]
): boolean {
  return Boolean(
    fulfillment.requires_shipping &&
      !fulfillment.canceled_at &&
      !fulfillment.delivered_at &&
      !fulfillment.shipped_at
  )
}

const OrderFulfillmentTrackingHint = ({
  data: order,
}: DetailWidgetProps<AdminOrder>) => {
  const pending = (order.fulfillments ?? []).filter(fulfillmentNeedsResi)

  if (!pending.length) {
    return null
  }

  return (
    <Container className="flex gap-x-3 px-4 py-3">
      <InformationCircleSolid className="text-ui-fg-muted mt-0.5 shrink-0" />
      <Text size="small" leading="compact" className="text-ui-fg-subtle">
        Untuk pengiriman kurir: klik <strong>Tandai sebagai dikirim</strong>,
        isi <strong>nomor resi</strong>, lalu baru{" "}
        <strong>Tandai sebagai terkirim</strong>. Tanpa resi, status terkirim
        tidak dapat diubah.
      </Text>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "order.details.before",
})

export default OrderFulfillmentTrackingHint
