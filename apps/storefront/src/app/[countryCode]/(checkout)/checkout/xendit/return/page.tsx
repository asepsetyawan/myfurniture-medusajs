import XenditReturn from "@modules/checkout/components/xendit-return"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Payment confirmation",
}

export default function XenditReturnPage() {
  return <XenditReturn />
}
