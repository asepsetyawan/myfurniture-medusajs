export const XENDIT_CONFIG_MODULE = "xenditConfig"

export const XENDIT_SETTING_ID = "default"

/** Medusa webhook route segment (full provider id: pp_{segment}). */
export const XENDIT_WEBHOOK_PROVIDER_PATH = "xendit_xendit"

export function buildDefaultXenditWebhookUrl(backendUrl: string): string {
  const base = backendUrl.replace(/\/$/, "")
  return `${base}/hooks/payment/${XENDIT_WEBHOOK_PROVIDER_PATH}`
}
