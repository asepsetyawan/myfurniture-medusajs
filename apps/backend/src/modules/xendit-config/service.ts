import { MedusaService } from "@medusajs/framework/utils"
import XenditSetting from "./models/xendit-setting"
import {
  XENDIT_SETTING_ID,
  buildDefaultXenditWebhookUrl,
} from "./constants"
import { getEnvWebhookUrl } from "./runtime-config"
import {
  getEnvFallbackConfig,
  isMaskedSecretInput,
  maskSecret,
  registerXenditConfigDbLoader,
  setXenditRuntimeConfig,
  type XenditRuntimeConfig,
} from "./runtime-config"

export type XenditAdminConfig = {
  secret_key: string | null
  secret_key_set: boolean
  webhook_token: string | null
  webhook_token_set: boolean
  storefront_url: string
  invoice_duration_seconds: number
  is_enabled: boolean
  webhook_url: string
  /** Auto-generated from backend URL; use "Reset" in admin to apply. */
  default_webhook_url: string
}

export type UpdateXenditConfigInput = {
  secret_key?: string
  webhook_token?: string
  storefront_url?: string
  webhook_url?: string
  invoice_duration_seconds?: number
  is_enabled?: boolean
}

class XenditConfigModuleService extends MedusaService({
  XenditSetting,
}) {
  constructor(container: Record<string, unknown>) {
    super(container)
    this.registerRuntimeLoader()
    void this.syncRuntimeCache().catch(() => {
      // DB may be unavailable during migrations; admin save will refresh cache
    })
  }

  registerRuntimeLoader() {
    registerXenditConfigDbLoader(async () => {
      await this.syncRuntimeCache()
    })
  }

  resolveWebhookUrl(
    backendUrl: string,
    record?: { webhook_url?: string | null } | null
  ): string {
    const stored = record?.webhook_url?.trim()
    if (stored) {
      return stored.replace(/\/$/, "")
    }

    const fromEnv = getEnvWebhookUrl(backendUrl)
    if (fromEnv) {
      return fromEnv.replace(/\/$/, "")
    }

    return buildDefaultXenditWebhookUrl(backendUrl)
  }

  private buildRedirectUrls(storefrontUrl: string) {
    const base = storefrontUrl.replace(/\/$/, "")
    return {
      successRedirectUrl: `${base}/checkout/xendit/return`,
      failureRedirectUrl: `${base}/checkout?step=payment`,
    }
  }

  private toRuntimeConfig(record: {
    secret_key?: string | null
    webhook_token?: string | null
    storefront_url?: string | null
    invoice_duration_seconds?: number | null
    is_enabled?: boolean | null
  }): XenditRuntimeConfig {
    const env = getEnvFallbackConfig()
    const storefrontUrl = record.storefront_url || env.storefrontUrl
    const redirects = this.buildRedirectUrls(storefrontUrl)

    const secretKey = record.secret_key || env.secretKey
    const webhookToken = record.webhook_token || env.webhookToken

    return {
      secretKey,
      webhookToken,
      storefrontUrl,
      invoiceDurationSeconds:
        record.invoice_duration_seconds ?? env.invoiceDurationSeconds,
      isEnabled:
        record.is_enabled === true ||
        (record.is_enabled == null && Boolean(secretKey && webhookToken)),
      ...redirects,
    }
  }

  async syncRuntimeCache(): Promise<XenditRuntimeConfig> {
    const config = await this.getEffectiveConfig()
    setXenditRuntimeConfig(config)
    return config
  }

  async getEffectiveConfig(): Promise<XenditRuntimeConfig> {
    try {
      const record = await this.retrieveXenditSetting(XENDIT_SETTING_ID)
      return this.toRuntimeConfig(record)
    } catch {
      return getEnvFallbackConfig()
    }
  }

  async getAdminConfig(backendUrl: string): Promise<XenditAdminConfig> {
    let record: {
      secret_key?: string | null
      webhook_token?: string | null
      storefront_url?: string | null
      webhook_url?: string | null
      invoice_duration_seconds?: number | null
      is_enabled?: boolean | null
    } | null = null

    try {
      record = await this.retrieveXenditSetting(XENDIT_SETTING_ID)
    } catch {
      record = null
    }

    const env = getEnvFallbackConfig()
    const secretKey = record?.secret_key || env.secretKey
    const webhookToken = record?.webhook_token || env.webhookToken
    const defaultWebhookUrl = buildDefaultXenditWebhookUrl(backendUrl)

    return {
      secret_key: maskSecret(secretKey),
      secret_key_set: Boolean(secretKey),
      webhook_token: maskSecret(webhookToken),
      webhook_token_set: Boolean(webhookToken),
      storefront_url: record?.storefront_url || env.storefrontUrl,
      invoice_duration_seconds:
        record?.invoice_duration_seconds ?? env.invoiceDurationSeconds,
      is_enabled: record?.is_enabled ?? env.isEnabled,
      webhook_url: this.resolveWebhookUrl(backendUrl, record),
      default_webhook_url: defaultWebhookUrl,
    }
  }

  async updateAdminConfig(
    input: UpdateXenditConfigInput,
    backendUrl: string
  ): Promise<XenditAdminConfig> {
    let existing: {
      secret_key?: string | null
      webhook_token?: string | null
      storefront_url?: string | null
      webhook_url?: string | null
      invoice_duration_seconds?: number | null
      is_enabled?: boolean | null
    } | null = null

    try {
      existing = await this.retrieveXenditSetting(XENDIT_SETTING_ID)
    } catch {
      existing = null
    }

    const env = getEnvFallbackConfig()

    const secretKey = isMaskedSecretInput(input.secret_key)
      ? existing?.secret_key || env.secretKey
      : input.secret_key || existing?.secret_key || env.secretKey

    const webhookToken = isMaskedSecretInput(input.webhook_token)
      ? existing?.webhook_token || env.webhookToken
      : input.webhook_token || existing?.webhook_token || env.webhookToken

    const webhookUrlInput =
      input.webhook_url !== undefined
        ? input.webhook_url.trim() || null
        : undefined

    const payload = {
      id: XENDIT_SETTING_ID,
      secret_key: secretKey || null,
      webhook_token: webhookToken || null,
      storefront_url:
        input.storefront_url ??
        existing?.storefront_url ??
        env.storefrontUrl,
      webhook_url:
        webhookUrlInput !== undefined
          ? webhookUrlInput
          : existing?.webhook_url ?? null,
      invoice_duration_seconds:
        input.invoice_duration_seconds ??
        existing?.invoice_duration_seconds ??
        env.invoiceDurationSeconds,
      is_enabled: input.is_enabled ?? existing?.is_enabled ?? false,
    }

    if (existing) {
      await this.updateXenditSettings(payload)
    } else {
      await this.createXenditSettings(payload)
    }

    await this.syncRuntimeCache()

    return this.getAdminConfig(backendUrl)
  }
}

export default XenditConfigModuleService
