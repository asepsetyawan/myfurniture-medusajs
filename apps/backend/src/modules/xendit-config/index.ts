import { Module } from "@medusajs/framework/utils"
import XenditConfigModuleService from "./service"
import { XENDIT_CONFIG_MODULE } from "./constants"

export { XENDIT_CONFIG_MODULE }

export default Module(XENDIT_CONFIG_MODULE, {
  service: XenditConfigModuleService,
})
