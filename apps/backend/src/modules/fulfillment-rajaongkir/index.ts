import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import RajaOngkirFulfillmentProviderService from "./service"

export default ModuleProvider(Modules.FULFILLMENT, {
  services: [RajaOngkirFulfillmentProviderService],
})
