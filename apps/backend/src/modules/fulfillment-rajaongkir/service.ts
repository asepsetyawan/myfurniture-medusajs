import {
  AbstractFulfillmentProviderService,
  MedusaError,
} from "@medusajs/framework/utils"
import type {
  CalculateShippingOptionPriceDTO,
  CalculatedShippingOptionPrice,
  CreateFulfillmentResult,
  FulfillmentOption,
  Logger,
} from "@medusajs/framework/types"
import { RajaOngkirClient } from "./client"
import {
  fetchDomesticRates,
  findRate,
  getCartWeightGrams,
  getDestinationIdFromContext,
  resolveRateAmount,
} from "./rates"
import { buildShippingOptionDefinitions } from "./service-catalog"

export type RajaOngkirOptions = {
  apiKey?: string
  originDestinationId?: string
  defaultWeightGrams?: number
}

type InjectedDependencies = {
  logger: Logger
}

class RajaOngkirFulfillmentProviderService extends AbstractFulfillmentProviderService {
  static identifier = "rajaongkir"

  protected logger_: Logger
  protected options_: RajaOngkirOptions
  protected client_: RajaOngkirClient | null = null

  constructor(
    { logger }: InjectedDependencies,
    options: RajaOngkirOptions = {}
  ) {
    super()

    this.logger_ = logger
    this.options_ = {
      defaultWeightGrams: 1000,
      ...options,
      apiKey: options.apiKey || process.env.RAJAONGKIR_API_KEY,
      originDestinationId:
        options.originDestinationId || process.env.RAJAONGKIR_ORIGIN_ID,
    }

    if (this.options_.apiKey) {
      this.client_ = new RajaOngkirClient(this.options_.apiKey)
    }
  }

  private getClient(): RajaOngkirClient {
    if (!this.client_) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "RajaOngkir API key is not configured"
      )
    }

    return this.client_
  }

  private getOriginId(): string {
    const origin = this.options_.originDestinationId
    if (!origin) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "RajaOngkir origin destination ID is not configured (RAJAONGKIR_ORIGIN_ID)"
      )
    }

    return origin
  }

  async getFulfillmentOptions(): Promise<FulfillmentOption[]> {
    return buildShippingOptionDefinitions().map((option) => ({
      id: option.data.id,
      name: option.name,
      ...option.data,
    }))
  }

  async validateOption(): Promise<boolean> {
    return !!this.options_.apiKey
  }

  async canCalculate(): Promise<boolean> {
    return !!this.options_.apiKey && !!this.options_.originDestinationId
  }

  async validateFulfillmentData(
    optionData: Record<string, unknown>,
    data: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    return {
      ...data,
      courier: optionData.courier,
      service: optionData.service,
      payment_type: optionData.payment_type,
      courier_name: optionData.courier_name,
      service_label: optionData.service_label,
    }
  }

  async calculatePrice(
    optionData: CalculateShippingOptionPriceDTO["optionData"],
    _data: CalculateShippingOptionPriceDTO["data"],
    context: CalculateShippingOptionPriceDTO["context"]
  ): Promise<CalculatedShippingOptionPrice> {
    const courier = String(optionData?.courier || "")
    const service = String(optionData?.service || "")
    const paymentType = String(optionData?.payment_type || "prepaid")

    if (!courier || !service) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Invalid RajaOngkir shipping option configuration"
      )
    }

    const rates = await fetchDomesticRates(this.getClient(), {
      origin: this.getOriginId(),
      destination: getDestinationIdFromContext(context),
      weight: getCartWeightGrams(
        context,
        this.options_.defaultWeightGrams ?? 1000
      ),
    })

    const rate = findRate(rates, courier, service)

    if (!rate) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Layanan ${courier.toUpperCase()} ${service} tidak tersedia untuk rute ini`
      )
    }

    return {
      calculated_amount: resolveRateAmount(rate, paymentType),
      is_calculated_price_tax_inclusive: true,
    }
  }

  async createFulfillment(
    data: Record<string, unknown>
  ): Promise<CreateFulfillmentResult> {
    return {
      data: {
        rajaongkir_courier: data.courier,
        rajaongkir_service: data.service,
        rajaongkir_payment_type: data.payment_type,
        rajaongkir_courier_name: data.courier_name,
        rajaongkir_service_label: data.service_label,
      },
      labels: [],
    }
  }

  async cancelFulfillment(): Promise<Record<string, unknown>> {
    return {}
  }

  async createReturnFulfillment(): Promise<CreateFulfillmentResult> {
    return {
      data: {},
      labels: [],
    }
  }
}

export default RajaOngkirFulfillmentProviderService
