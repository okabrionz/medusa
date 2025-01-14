import { Router } from "express"

import { isFeatureFlagEnabled } from "../../../middlewares/feature-flag-enabled"
import PublishableAPIKeysFeatureFlag from "../../../../loaders/feature-flags/publishable-api-keys"
import middlewares, {
  transformBody,
  transformQuery,
} from "../../../middlewares"
import { GetPublishableApiKeysParams } from "./list-publishable-api-keys"
import { PublishableApiKey } from "../../../../models"
import { DeleteResponse, PaginatedResponse } from "../../../../types/common"
import { AdminPostPublishableApiKeysReq } from "./create-publishable-api-key"
import { AdminPostPublishableApiKeysPublishableApiKeyReq } from "./update-publishable-api-key"
import { AdminDeletePublishableApiKeySalesChannelsBatchReq } from "./delete-channels-batch"
import { AdminPostPublishableApiKeySalesChannelsBatchReq } from "./add-channels-batch"
import { GetPublishableApiKeySalesChannelsParams } from "./list-publishable-api-key-sales-channels"

const route = Router()

export default (app) => {
  app.use(
    "/publishable-api-keys",
    isFeatureFlagEnabled(PublishableAPIKeysFeatureFlag.key),
    route
  )

  route.post(
    "/",
    transformBody(AdminPostPublishableApiKeysReq),
    middlewares.wrap(require("./create-publishable-api-key").default)
  )

  route.get(
    "/:id",
    middlewares.wrap(require("./get-publishable-api-key").default)
  )

  route.post(
    "/:id",
    transformBody(AdminPostPublishableApiKeysPublishableApiKeyReq),
    middlewares.wrap(require("./update-publishable-api-key").default)
  )

  route.delete(
    "/:id",
    middlewares.wrap(require("./delete-publishable-api-key").default)
  )

  route.post(
    "/:id/revoke",
    middlewares.wrap(require("./revoke-publishable-api-key").default)
  )

  route.get(
    "/",
    transformQuery(GetPublishableApiKeysParams, {
      isList: true,
    }),
    middlewares.wrap(require("./list-publishable-api-keys").default)
  )

  route.get(
    "/:id/sales-channels",
    transformQuery(GetPublishableApiKeySalesChannelsParams, { isList: true }),
    middlewares.wrap(
      require("./list-publishable-api-key-sales-channels").default
    )
  )

  route.post(
    "/:id/sales-channels/batch",
    transformBody(AdminPostPublishableApiKeySalesChannelsBatchReq),
    middlewares.wrap(require("./add-channels-batch").default)
  )

  route.delete(
    "/:id/sales-channels/batch",
    transformBody(AdminDeletePublishableApiKeySalesChannelsBatchReq),
    middlewares.wrap(require("./delete-channels-batch").default)
  )
}

export type AdminPublishableApiKeysRes = {
  publishable_api_key: PublishableApiKey
}
export type AdminPublishableApiKeysListRes = PaginatedResponse & {
  publishable_api_keys: PublishableApiKey[]
}
export type AdminPublishableApiKeyDeleteRes = DeleteResponse

export * from "./add-channels-batch"
export * from "./delete-channels-batch"
export * from "./list-publishable-api-keys"
export * from "./list-publishable-api-key-sales-channels"
export * from "./create-publishable-api-key"
export * from "./update-publishable-api-key"
