export type XenditRuntimeConfig = {
  secretKey: string
  webhookToken: string
  storefrontUrl: string
  invoiceDurationSeconds: number
  isEnabled: boolean
  successRedirectUrl?: string
  failureRedirectUrl?: string
}

const MASK = "••••••••"

let cache: XenditRuntimeConfig | null = null
let dbLoader: (() => Promise<void>) | null = null

export function registerXenditConfigDbLoader(loader: () => Promise<void>) {
  dbLoader = loader
}

export function setXenditRuntimeConfig(config: XenditRuntimeConfig) {
  cache = config
}

export function getXenditRuntimeConfig(): XenditRuntimeConfig {
  if (cache) {
    return cache
  }

  return getEnvFallbackConfig()
}

export async function ensureXenditConfigLoaded(): Promise<XenditRuntimeConfig> {
  const shouldLoadFromDb =
    dbLoader && (!cache || (!cache.secretKey && !cache.webhookToken))

  if (shouldLoadFromDb) {
    try {
      await dbLoader()
    } catch {
      // fall through to env
    }
  }

  return getXenditRuntimeConfig()
}

export function getEnvWebhookUrl(backendUrl: string): string | undefined {
  const fromEnv = process.env.XENDIT_WEBHOOK_URL?.trim()
  return fromEnv || undefined
}

export function getEnvFallbackConfig(): XenditRuntimeConfig {
  const storefrontUrl =
    process.env.STORE_FRONT_URL || "http://localhost:8000"

  return {
    secretKey: process.env.XENDIT_SECRET_KEY || "",
    webhookToken: process.env.XENDIT_WEBHOOK_TOKEN || "",
    storefrontUrl,
    invoiceDurationSeconds: Number(
      process.env.XENDIT_INVOICE_DURATION_SECONDS || 86400
    ),
    isEnabled: Boolean(
      process.env.XENDIT_SECRET_KEY && process.env.XENDIT_WEBHOOK_TOKEN
    ),
    successRedirectUrl: `${storefrontUrl}/checkout/xendit/return`,
    failureRedirectUrl: `${storefrontUrl}/checkout?step=payment`,
  }
}

export function maskSecret(value?: string | null): string | null {
  if (!value) {
    return null
  }

  if (value.length <= 4) {
    return MASK
  }

  return `${MASK}${value.slice(-4)}`
}

export function isMaskedSecretInput(value?: string | null): boolean {
  return !value || value.startsWith("••")
}
