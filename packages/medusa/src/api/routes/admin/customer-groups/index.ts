import { Router } from "express"
import { Customer, CustomerGroup } from "../../../.."
import { DeleteResponse, PaginatedResponse } from "../../../../types/common"
import middlewares from "../../../middlewares"

const route = Router()

export default (app) => {
  app.use("/customer-groups", route)

  route.post("/", middlewares.wrap(require("./create-customer-group").default))
  route.post(
    "/:id/batch",
    middlewares.wrap(require("./add-customers-batch").default)
  )
  return app
}

export type AdminCustomersRes = {
  customerGroup: CustomerGroup
}

export type AdminCustomerGroupsDeleteRes = DeleteResponse

export type AdminCustomerGroupsListRes = PaginatedResponse & {
  customerGroups: Customer[]
}

export * from "./create-customer-group"