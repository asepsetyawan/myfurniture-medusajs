import { MedusaContainer } from "@medusajs/framework";
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  Modules,
} from "@medusajs/framework/utils";
import {
  createApiKeysWorkflow,
  createProductCategoriesWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createStoresWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
} from "@medusajs/medusa/core-flows";

import { WOODMART_CATEGORIES } from "../scripts/data/woodmart-catalog";
import {
  RAJAONGKIR_COURIER_SHIPPING_OPTIONS,
  RAJAONGKIR_PROVIDER_ID,
} from "../modules/fulfillment-rajaongkir/shipping-options";

export default async function initial_data_seed({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(
    ModuleRegistrationName.FULFILLMENT
  );

  const countries = ["gb", "de", "dk", "se", "fr", "es", "it"];
  const USD_TO_IDR = 16000;

  logger.info("Seeding store data...");
  const {
    result: [defaultSalesChannel],
  } = await createSalesChannelsWorkflow(container).run({
    input: {
      salesChannelsData: [
        {
          name: "Default Sales Channel",
          description: "Created by Medusa",
        },
      ],
    },
  });

  const {
    result: [publishableApiKey],
  } = await createApiKeysWorkflow(container).run({
    input: {
      api_keys: [
        {
          title: "Default Publishable API Key",
          type: "publishable",
          created_by: "",
        },
      ],
    },
  });

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel.id],
    },
  });

  const {
    result: [store],
  } = await createStoresWorkflow(container).run({
    input: {
      stores: [
        {
          name: "Default Store",
          supported_currencies: [
            {
              currency_code: "eur",
              is_default: true,
            },
            {
              currency_code: "usd",
              is_default: false,
            },
            {
              currency_code: "idr",
              is_default: false,
            },
          ],
          default_sales_channel_id: defaultSalesChannel.id,
        },
      ],
    },
  });

  logger.info("Seeding region data...");
  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "Europe",
          currency_code: "eur",
          countries,
          payment_providers: ["pp_system_default"],
        },
        {
          name: "Indonesia",
          currency_code: "idr",
          countries: ["id"],
          payment_providers: ["pp_xendit_xendit"],
        },
      ],
    },
  });
  const region = regionResult[0];
  const indonesiaRegion = regionResult[1];
  logger.info("Finished seeding regions.");

  logger.info("Seeding tax regions...");
  await createTaxRegionsWorkflow(container).run({
    input: [
      ...countries.map((country_code) => ({
        country_code,
        provider_id: "tp_system",
      })),
      {
        country_code: "id",
        provider_id: "tp_system",
      },
    ],
  });
  logger.info("Finished seeding tax regions.");

  logger.info("Seeding stock location data...");
  const { result: stockLocationResult } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "European Warehouse",
          address: {
            city: "Copenhagen",
            country_code: "DK",
            address_1: "",
          },
        },
      ],
    },
  });
  const stockLocation = stockLocationResult[0];

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  });

  logger.info("Seeding fulfillment data...");
  // This is created by a migration script in core.
  const { data: shippingProfileResult } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  });
  const shippingProfile = shippingProfileResult[0];

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "European Warehouse delivery",
    type: "shipping",
    service_zones: [
      {
        name: "Europe",
        geo_zones: [
          {
            country_code: "gb",
            type: "country",
          },
          {
            country_code: "de",
            type: "country",
          },
          {
            country_code: "dk",
            type: "country",
          },
          {
            country_code: "se",
            type: "country",
          },
          {
            country_code: "fr",
            type: "country",
          },
          {
            country_code: "es",
            type: "country",
          },
          {
            country_code: "it",
            type: "country",
          },
        ],
      },
    ],
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: fulfillmentSet.id,
    },
  });

  logger.info("Finished seeding fulfillment data.");

  logger.info("Seeding Indonesia stock location data...");
  const { result: indonesiaStockLocationResult } =
    await createStockLocationsWorkflow(container).run({
      input: {
        locations: [
          {
            name: "Indonesia Warehouse",
            address: {
              city: "Jakarta",
              country_code: "ID",
              address_1: "",
            },
          },
        ],
      },
    });
  const indonesiaStockLocation = indonesiaStockLocationResult[0];

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: indonesiaStockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: indonesiaStockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: RAJAONGKIR_PROVIDER_ID,
    },
  });

  const indonesiaFulfillmentSet =
    await fulfillmentModuleService.createFulfillmentSets({
      name: "Indonesia Warehouse delivery",
      type: "shipping",
      service_zones: [
        {
          name: "Indonesia",
          geo_zones: [
            {
              country_code: "id",
              type: "country",
            },
          ],
        },
      ],
    });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: indonesiaStockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: indonesiaFulfillmentSet.id,
    },
  });

  await createShippingOptionsWorkflow(container).run({
    input: RAJAONGKIR_COURIER_SHIPPING_OPTIONS.map((option) => ({
      name: option.name,
      price_type: "calculated" as const,
      provider_id: RAJAONGKIR_PROVIDER_ID,
      service_zone_id: indonesiaFulfillmentSet.service_zones[0].id,
      shipping_profile_id: shippingProfile.id,
      type: option.type,
      data: option.data,
      rules: [
        {
          attribute: "enabled_in_store",
          value: "true",
          operator: "eq",
        },
        {
          attribute: "is_return",
          value: "false",
          operator: "eq",
        },
      ],
    })),
  });
  logger.info("Finished seeding Indonesia fulfillment data.");

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel.id],
    },
  });

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: indonesiaStockLocation.id,
      add: [defaultSalesChannel.id],
    },
  });
  logger.info("Finished seeding stock location data.");

  logger.info("Seeding category data...");
  await createProductCategoriesWorkflow(container).run({
    input: {
      product_categories: WOODMART_CATEGORIES.map((category, index) => ({
        name: category.name,
        handle: category.handle,
        description: category.description,
        is_active: true,
        rank: index,
        metadata: {
          icon: category.icon,
        },
      })),
    },
  });
  logger.info("Finished seeding categories.");
}
