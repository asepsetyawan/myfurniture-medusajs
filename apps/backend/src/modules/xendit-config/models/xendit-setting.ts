import { model } from "@medusajs/framework/utils"

const XenditSetting = model.define("xendit_setting", {
  id: model.id().primaryKey(),
  secret_key: model.text().nullable(),
  webhook_token: model.text().nullable(),
  storefront_url: model.text().nullable(),
  webhook_url: model.text().nullable(),
  invoice_duration_seconds: model.number().default(86400),
  is_enabled: model.boolean().default(false),
})

export default XenditSetting
