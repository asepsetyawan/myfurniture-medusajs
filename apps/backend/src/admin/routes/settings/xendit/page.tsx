import { defineRouteConfig } from "@medusajs/admin-sdk"
import { CreditCard } from "@medusajs/icons"
import {
  Button,
  Container,
  Heading,
  Input,
  Label,
  Switch,
  Text,
  toast,
} from "@medusajs/ui"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { sdk } from "../../../lib/sdk"

type XenditAdminConfig = {
  secret_key: string | null
  secret_key_set: boolean
  webhook_token: string | null
  webhook_token_set: boolean
  storefront_url: string
  invoice_duration_seconds: number
  is_enabled: boolean
  webhook_url: string
  default_webhook_url: string
}

type ConfigResponse = {
  config: XenditAdminConfig
}

const XenditSettingsPage = () => {
  const queryClient = useQueryClient()

  const [secretKey, setSecretKey] = useState("")
  const [webhookToken, setWebhookToken] = useState("")
  const [storefrontUrl, setStorefrontUrl] = useState("")
  const [invoiceDurationHours, setInvoiceDurationHours] = useState("24")
  const [isEnabled, setIsEnabled] = useState(false)
  const [webhookUrl, setWebhookUrl] = useState("")

  const { data, isLoading } = useQuery({
    queryKey: ["xendit-config"],
    queryFn: () =>
      sdk.client.fetch<ConfigResponse>("/admin/xendit/config", {
        method: "GET",
      }),
  })

  useEffect(() => {
    if (!data?.config) {
      return
    }

    const config = data.config
    setSecretKey(config.secret_key || "")
    setWebhookToken(config.webhook_token || "")
    setStorefrontUrl(config.storefront_url)
    setInvoiceDurationHours(
      String(Math.max(1, Math.round(config.invoice_duration_seconds / 3600)))
    )
    setIsEnabled(config.is_enabled)
    setWebhookUrl(config.webhook_url || "")
  }, [data])

  const { mutateAsync: saveConfig, isPending } = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      sdk.client.fetch<ConfigResponse>("/admin/xendit/config", {
        method: "POST",
        body: payload,
      }),
    onSuccess: (response) => {
      queryClient.setQueryData(["xendit-config"], response)
      const config = response.config
      setSecretKey(config.secret_key || "")
      setWebhookToken(config.webhook_token || "")
      setWebhookUrl(config.webhook_url || "")
      toast.success("Xendit settings saved")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to save Xendit settings")
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const hours = Number(invoiceDurationHours)
    if (Number.isNaN(hours) || hours < 1) {
      toast.error("Invoice duration must be at least 1 hour")
      return
    }

    await saveConfig({
      secret_key: secretKey || undefined,
      webhook_token: webhookToken || undefined,
      storefront_url: storefrontUrl,
      webhook_url: webhookUrl,
      invoice_duration_seconds: Math.round(hours * 3600),
      is_enabled: isEnabled,
    })
  }

  const config = data?.config

  return (
    <Container className="divide-y p-0">
      <div className="flex flex-col gap-y-1 px-6 py-4">
        <Heading level="h1">Xendit Payment</Heading>
        <Text className="text-ui-fg-subtle text-sm">
          Configure Xendit for Indonesian payments (VA, e-wallet, QRIS, cards).
          Credentials are stored securely in your database.
        </Text>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-y-8 px-6 py-6">
        <div className="flex flex-col gap-y-6 max-w-xl">
          <div className="flex items-center justify-between gap-x-4">
            <div>
              <Label htmlFor="xendit-enabled">Enable Xendit</Label>
              <Text className="text-ui-fg-subtle text-xs mt-1">
                Show Xendit as a payment option when configured for a region.
              </Text>
            </div>
            <Switch
              id="xendit-enabled"
              checked={isEnabled}
              onCheckedChange={setIsEnabled}
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <Label htmlFor="xendit-secret-key">Secret API Key</Label>
            <Input
              id="xendit-secret-key"
              type="password"
              placeholder={
                config?.secret_key_set
                  ? "Leave blank to keep current key"
                  : "xnd_development_..."
              }
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              autoComplete="off"
            />
            <Text className="text-ui-fg-subtle text-xs">
              From Xendit Dashboard → Settings → Developers → API Keys.
            </Text>
          </div>

          <div className="flex flex-col gap-y-2">
            <Label htmlFor="xendit-webhook-token">Webhook Verification Token</Label>
            <Input
              id="xendit-webhook-token"
              type="password"
              placeholder={
                config?.webhook_token_set
                  ? "Leave blank to keep current token"
                  : "Your callback verification token"
              }
              value={webhookToken}
              onChange={(e) => setWebhookToken(e.target.value)}
              autoComplete="off"
            />
            <Text className="text-ui-fg-subtle text-xs">
              Set the same token in Xendit Dashboard when configuring the
              invoice webhook.
            </Text>
          </div>

          <div className="flex flex-col gap-y-2">
            <Label htmlFor="xendit-storefront-url">Storefront URL</Label>
            <Input
              id="xendit-storefront-url"
              type="url"
              placeholder="http://localhost:8000"
              value={storefrontUrl}
              onChange={(e) => setStorefrontUrl(e.target.value)}
            />
            <Text className="text-ui-fg-subtle text-xs">
              Used for payment success and failure redirects.
            </Text>
          </div>

          <div className="flex flex-col gap-y-2">
            <Label htmlFor="xendit-invoice-duration">
              Invoice expiry (hours)
            </Label>
            <Input
              id="xendit-invoice-duration"
              type="number"
              min={1}
              value={invoiceDurationHours}
              onChange={(e) => setInvoiceDurationHours(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between gap-x-4">
              <Label htmlFor="xendit-webhook-url">Webhook URL</Label>
              {config?.default_webhook_url ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="small"
                  onClick={() => setWebhookUrl(config.default_webhook_url)}
                >
                  Reset to default
                </Button>
              ) : null}
            </div>
            <Input
              id="xendit-webhook-url"
              type="url"
              placeholder={
                config?.default_webhook_url ||
                "http://localhost:9000/hooks/payment/xendit_xendit"
              }
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
            />
            <Text className="text-ui-fg-subtle text-xs">
              Register this URL in Xendit Dashboard for invoice webhooks. Path
              must be{" "}
              <span className="font-mono">/hooks/payment/xendit_xendit</span>{" "}
              (do not include the <span className="font-mono">pp_</span> prefix).
              Clear the field and save to use the default from your backend URL.
            </Text>
          </div>
        </div>

        <div className="flex items-center gap-x-2">
          <Button type="submit" isLoading={isPending} disabled={isLoading}>
            Save configuration
          </Button>
        </div>
      </form>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Xendit",
  icon: CreditCard,
})

export default XenditSettingsPage
