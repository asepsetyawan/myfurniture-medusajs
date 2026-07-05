import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { XENDIT_CONFIG_MODULE } from "../../../../modules/xendit-config"
import type XenditConfigModuleService from "../../../../modules/xendit-config/service"
import type { UpdateXenditConfigInput } from "../../../../modules/xendit-config/service"
import { isMaskedSecretInput } from "../../../../modules/xendit-config/runtime-config"

function getBackendUrl(req: MedusaRequest): string {
  const fromEnv = process.env.MEDUSA_BACKEND_URL
  if (fromEnv) {
    return fromEnv
  }

  const protocol = req.protocol || "http"
  const host = req.get("host")
  return host ? `${protocol}://${host}` : "http://localhost:9000"
}

function resolveConfigService(req: MedusaRequest): XenditConfigModuleService {
  const service = req.scope.resolve(
    XENDIT_CONFIG_MODULE
  ) as XenditConfigModuleService
  service.registerRuntimeLoader()
  return service
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service = resolveConfigService(req)
  await service.syncRuntimeCache()

  const config = await service.getAdminConfig(getBackendUrl(req))
  res.json({ config })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const body = req.body as UpdateXenditConfigInput

  if (body.webhook_url !== undefined && body.webhook_url.trim()) {
    try {
      const parsed = new URL(body.webhook_url.trim())
      if (!parsed.pathname.includes("/hooks/payment/")) {
        throw new Error("invalid path")
      }
    } catch {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Webhook URL must be a valid URL ending with /hooks/payment/{provider} (e.g. …/hooks/payment/xendit_xendit)."
      )
    }
  }

  if (body.invoice_duration_seconds !== undefined) {
    const duration = Number(body.invoice_duration_seconds)
    if (Number.isNaN(duration) || duration < 300) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Invoice duration must be at least 300 seconds (5 minutes)."
      )
    }
  }

  const service = resolveConfigService(req)

  if (body.is_enabled) {
    const preview = await service.getEffectiveConfig()
    const nextSecret = !isMaskedSecretInput(body.secret_key)
      ? body.secret_key
      : preview.secretKey
    const nextWebhook = !isMaskedSecretInput(body.webhook_token)
      ? body.webhook_token
      : preview.webhookToken

    if (!nextSecret || !nextWebhook) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Secret API key and webhook token are required when Xendit is enabled."
      )
    }
  }

  const config = await service.updateAdminConfig(body, getBackendUrl(req))

  res.json({ config })
}
