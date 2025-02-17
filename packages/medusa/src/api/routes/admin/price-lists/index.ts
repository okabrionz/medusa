import { Router } from "express"
import "reflect-metadata"
import { PriceList } from "../../../.."
import { DeleteResponse, PaginatedResponse } from "../../../../types/common"
import middlewares, {
  transformQuery,
  transformBody,
} from "../../../middlewares"
import { AdminGetPriceListPaginationParams } from "./list-price-lists"
import { AdminGetPriceListsPriceListProductsParams } from "./list-price-list-products"
import {
  defaultAdminProductFields,
  defaultAdminProductRelations,
} from "../products"
import { AdminPostPriceListsPriceListReq } from "./create-price-list"
import { FlagRouter } from "../../../../utils/flag-router"
import TaxInclusivePricingFeatureFlag from "../../../../loaders/feature-flags/tax-inclusive-pricing"

const route = Router()

export default (app, featureFlagRouter: FlagRouter) => {
  app.use("/price-lists", route)

  if (featureFlagRouter.isFeatureEnabled(TaxInclusivePricingFeatureFlag.key)) {
    defaultAdminPriceListFields.push("includes_tax")
  }

  route.get("/:id", middlewares.wrap(require("./get-price-list").default))

  route.get(
    "/",
    transformQuery(AdminGetPriceListPaginationParams, { isList: true }),
    middlewares.wrap(require("./list-price-lists").default)
  )

  route.get(
    "/:id/products",
    transformQuery(AdminGetPriceListsPriceListProductsParams, {
      defaultFields: defaultAdminProductFields,
      defaultRelations: defaultAdminProductRelations.filter(
        (r) => r !== "variants.prices"
      ),
      defaultLimit: 50,
      isList: true,
    }),
    middlewares.wrap(require("./list-price-list-products").default)
  )

  route.delete(
    "/:id/products/:product_id/prices",
    middlewares.wrap(require("./delete-product-prices").default)
  )
  route.delete(
    "/:id/variants/:variant_id/prices",
    middlewares.wrap(require("./delete-variant-prices").default)
  )

  route.post(
    "/",
    transformBody(AdminPostPriceListsPriceListReq),
    middlewares.wrap(require("./create-price-list").default)
  )

  route.post("/:id", middlewares.wrap(require("./update-price-list").default))

  route.delete("/:id", middlewares.wrap(require("./delete-price-list").default))

  route.delete(
    "/:id/prices/batch",
    middlewares.wrap(require("./delete-prices-batch").default)
  )

  route.post(
    "/:id/prices/batch",
    middlewares.wrap(require("./add-prices-batch").default)
  )

  return app
}

export const defaultAdminPriceListFields = [
  "id",
  "name",
  "description",
  "type",
  "status",
  "starts_at",
  "ends_at",
  "created_at",
  "updated_at",
  "deleted_at",
]

export const defaultAdminPriceListRelations = ["prices", "customer_groups"]

export type AdminPriceListRes = {
  price_list: PriceList
}

export type AdminPriceListDeleteBatchRes = {
  ids: string[]
  deleted: boolean
  object: string
}

export type AdminPriceListDeleteProductPricesRes = AdminPriceListDeleteBatchRes
export type AdminPriceListDeleteVariantPricesRes = AdminPriceListDeleteBatchRes

export type AdminPriceListDeleteRes = DeleteResponse

export type AdminPriceListsListRes = PaginatedResponse & {
  price_lists: PriceList[]
}

export * from "./add-prices-batch"
export * from "./create-price-list"
export * from "./delete-price-list"
export * from "./get-price-list"
export * from "./list-price-lists"
export * from "./update-price-list"
export * from "./delete-prices-batch"
export * from "./list-price-list-products"
