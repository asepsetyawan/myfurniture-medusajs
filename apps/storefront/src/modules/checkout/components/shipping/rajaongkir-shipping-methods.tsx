"use client"

import { setShippingMethod } from "@lib/data/cart"
import {
  fetchRajaOngkirShippingQuotes,
  RajaOngkirShippingQuote,
} from "@lib/data/rajaongkir"
import { convertToLocale } from "@lib/util/money"
import { Loader } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import MedusaRadio from "@modules/common/components/radio"
import { clx, Text } from "@modules/common/components/ui"
import { Radio, RadioGroup } from "@headlessui/react"
import { useEffect, useMemo, useState } from "react"

const RAJAONGKIR_PROVIDER_ID = "rajaongkir_rajaongkir"

type PaymentMode = "prepaid" | "cod"

type RajaOngkirShippingMethodsProps = {
  cart: HttpTypes.StoreCart
  options: HttpTypes.StoreCartShippingOption[]
  shippingMethodId: string | null
  onSelectId: (id: string | null) => void
  onLoadingChange?: (loading: boolean) => void
  onError?: (message: string | null) => void
}

function getOptionMeta(option: HttpTypes.StoreCartShippingOption) {
  const data = (option.data || {}) as Record<string, string>
  return {
    courier: data.courier || "",
    courierName: data.courier_name || data.courier || "",
    paymentType: (data.payment_type || "prepaid") as PaymentMode,
  }
}

const RajaOngkirShippingMethods = ({
  cart,
  options,
  shippingMethodId,
  onSelectId,
  onLoadingChange,
  onError,
}: RajaOngkirShippingMethodsProps) => {
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("prepaid")
  const [quotes, setQuotes] = useState<RajaOngkirShippingQuote[]>([])
  const [isLoadingQuotes, setIsLoadingQuotes] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const hasDestination = Boolean(
    (
      cart.shipping_address?.metadata as Record<string, unknown> | undefined
    )?.rajaongkir_destination_id
  )

  useEffect(() => {
    if (!hasDestination) {
      setQuotes([])
      setIsLoadingQuotes(false)
      onLoadingChange?.(false)
      return
    }

    setIsLoadingQuotes(true)
    onLoadingChange?.(true)

    fetchRajaOngkirShippingQuotes(cart.id).then((result) => {
      setQuotes(result)
      setIsLoadingQuotes(false)
      onLoadingChange?.(false)
    })
  }, [cart.id, hasDestination, cart.shipping_address?.metadata])

  const quotesMap = useMemo(
    () => new Map(quotes.map((q) => [q.shipping_option_id, q])),
    [quotes]
  )

  const filteredOptions = useMemo(
    () =>
      options.filter((o) => getOptionMeta(o).paymentType === paymentMode),
    [options, paymentMode]
  )

  const groupedByCourier = useMemo(() => {
    const groups = new Map<
      string,
      { courierName: string; options: HttpTypes.StoreCartShippingOption[] }
    >()

    for (const option of filteredOptions) {
      const meta = getOptionMeta(option)
      const key = meta.courier || "other"
      const existing = groups.get(key)
      if (existing) {
        existing.options.push(option)
      } else {
        groups.set(key, {
          courierName: meta.courierName || key.toUpperCase(),
          options: [option],
        })
      }
    }

    return Array.from(groups.values())
  }, [filteredOptions])

  const handleSelect = async (optionId: string) => {
    onError?.(null)
    const previous = shippingMethodId
    onSelectId(optionId)
    setIsSubmitting(true)

    try {
      await setShippingMethod({ cartId: cart.id, shippingMethodId: optionId })
    } catch (err: unknown) {
      onSelectId(previous)
      onError?.(err instanceof Error ? err.message : "Gagal memilih pengiriman")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!hasDestination) {
    return (
      <Text className="text-ui-fg-muted text-small-regular">
        Lengkapi area pengiriman di langkah alamat untuk melihat ongkir.
      </Text>
    )
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex gap-2 p-1 bg-ui-bg-subtle rounded-rounded w-fit">
        <button
          type="button"
          onClick={() => setPaymentMode("prepaid")}
          className={clx(
            "px-4 py-2 text-small-regular rounded-rounded transition-colors",
            paymentMode === "prepaid"
              ? "bg-white shadow-borders-base text-ui-fg-base"
              : "text-ui-fg-muted hover:text-ui-fg-subtle"
          )}
        >
          Bayar di muka
        </button>
        <button
          type="button"
          onClick={() => setPaymentMode("cod")}
          className={clx(
            "px-4 py-2 text-small-regular rounded-rounded transition-colors",
            paymentMode === "cod"
              ? "bg-white shadow-borders-base text-ui-fg-base"
              : "text-ui-fg-muted hover:text-ui-fg-subtle"
          )}
        >
          COD (bayar di tempat)
        </button>
      </div>

      {isLoadingQuotes ? (
        <div className="flex items-center gap-2 text-ui-fg-muted py-4">
          <Loader />
          <span className="text-small-regular">Menghitung ongkir...</span>
        </div>
      ) : (
        groupedByCourier.map((group) => (
          <div key={group.courierName}>
            <Text className="txt-medium-plus text-ui-fg-base mb-2">
              {group.courierName}
            </Text>
            <RadioGroup
              value={shippingMethodId}
              onChange={(v) => {
                if (v && !isSubmitting) {
                  void handleSelect(v)
                }
              }}
            >
              {group.options.map((option) => {
                const quote = quotesMap.get(option.id)
                const available =
                  quote?.available !== false && quote?.amount != null
                const isDisabled = !isLoadingQuotes && !available

                return (
                  <Radio
                    key={option.id}
                    value={option.id}
                    disabled={isDisabled || isSubmitting}
                    className={clx(
                      "flex items-center justify-between text-small-regular cursor-pointer py-4 border rounded-rounded px-6 mb-2 hover:shadow-borders-interactive-with-active",
                      {
                        "border-ui-border-interactive":
                          option.id === shippingMethodId,
                        "opacity-50 cursor-not-allowed": isDisabled,
                      }
                    )}
                  >
                    <div className="flex items-start gap-x-3 min-w-0">
                      <MedusaRadio
                        checked={option.id === shippingMethodId}
                        className="mt-1 shrink-0"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="text-base-regular">
                          {option.type?.label || option.name}
                        </span>
                        <span className="text-small-regular text-ui-fg-muted">
                          {quote?.description || option.type?.description}
                          {quote?.etd ? ` · Est. ${quote.etd}` : ""}
                        </span>
                      </div>
                    </div>
                    <span className="shrink-0 ml-4 text-ui-fg-base">
                      {quote?.amount != null ? (
                        convertToLocale({
                          amount: quote.amount,
                          currency_code: cart.currency_code,
                        })
                      ) : isDisabled ? (
                        "Tidak tersedia"
                      ) : (
                        <Loader />
                      )}
                    </span>
                  </Radio>
                )
              })}
            </RadioGroup>
          </div>
        ))
      )}
    </div>
  )
}

export { RAJAONGKIR_PROVIDER_ID }
export default RajaOngkirShippingMethods
