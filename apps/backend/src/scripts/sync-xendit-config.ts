import { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { XENDIT_CONFIG_MODULE } from "../modules/xendit-config"
import type XenditConfigModuleService from "../modules/xendit-config/service"

/**
 * Sync Xendit config from .env into the database and runtime cache.
 * Run: medusa exec ./src/scripts/sync-xendit-config.ts
 */
export default async function syncXenditConfig({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const service = container.resolve(
    XENDIT_CONFIG_MODULE
  ) as XenditConfigModuleService

  service.registerRuntimeLoader()

  const secretKey = process.env.XENDIT_SECRET_KEY
  const webhookToken = process.env.XENDIT_WEBHOOK_TOKEN

  if (!secretKey || !webhookToken) {
    logger.warn(
      "XENDIT_SECRET_KEY and XENDIT_WEBHOOK_TOKEN not set in .env — syncing cache from database only."
    )
    await service.syncRuntimeCache()
    return
  }

  const backendUrl =
    process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"

  await service.updateAdminConfig(
    {
      secret_key: secretKey,
      webhook_token: webhookToken,
      storefront_url: process.env.STORE_FRONT_URL,
      webhook_url: process.env.XENDIT_WEBHOOK_URL,
      invoice_duration_seconds: Number(
        process.env.XENDIT_INVOICE_DURATION_SECONDS || 86400
      ),
      is_enabled: true,
    },
    backendUrl
  )

  logger.info("Xendit configuration synced from environment variables.")
}
