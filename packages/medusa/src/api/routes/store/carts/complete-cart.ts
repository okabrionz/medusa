import { EntityManager } from "typeorm"
import { AbstractCartCompletionStrategy } from "../../../../interfaces"
import { IdempotencyKey } from "../../../../models"
import { IdempotencyKeyService } from "../../../../services"

/**
 * @oas [post] /carts/{id}/complete
 * summary: "Complete a Cart"
 * operationId: "PostCartsCartComplete"
 * description: "Completes a cart. The following steps will be performed. Payment
 *   authorization is attempted and if more work is required, we simply return
 *   the cart for further updates. If payment is authorized and order is not yet
 *   created, we make sure to do so. The completion of a cart can be performed
 *   idempotently with a provided header `Idempotency-Key`. If not provided, we
 *   will generate one for the request."
 * parameters:
 *   - (path) id=* {String} The Cart id.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.carts.complete(cart_id)
 *       .then(({ cart }) => {
 *         console.log(cart.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/store/carts/{id}/complete'
 * tags:
 *   - Cart
 * responses:
 *   200:
 *     description: "If a cart was successfully authorized, but requires further
 *       action from the user the response body will contain the cart with an
 *       updated payment session. If the Cart was successfully completed the
 *       response body will contain the newly created Order."
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               description: The type of the data property.
 *               enum: [order, cart, swap]
 *             data:
 *               type: object
 *               description: The data of the result object. Its type depends on the type field.
 *               oneOf:
 *                 - type: object
 *                   description: Cart was successfully authorized and order was placed successfully.
 *                   properties:
 *                     order:
 *                       $ref: "#/components/schemas/Order"
 *                 - type: object
 *                   description: Cart was successfully authorized but requires further actions.
 *                   properties:
 *                     cart:
 *                       $ref: "#/components/schemas/Cart"
 *                 - type: object
 *                   description: When cart is used for a swap and it has been completed successfully.
 *                   properties:
 *                     cart:
 *                       $ref: "#/components/schemas/Swap"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */
export default async (req, res) => {
  const { id } = req.params

  const manager: EntityManager = req.scope.resolve("manager")
  const idempotencyKeyService: IdempotencyKeyService = req.scope.resolve(
    "idempotencyKeyService"
  )

  const headerKey = req.get("Idempotency-Key") || ""

  let idempotencyKey: IdempotencyKey
  try {
    idempotencyKey = await manager.transaction(async (transactionManager) => {
      return await idempotencyKeyService
        .withTransaction(transactionManager)
        .initializeRequest(headerKey, req.method, req.params, req.path)
    })
  } catch (error) {
    console.log(error)
    res.status(409).send("Failed to create idempotency key")
    return
  }

  res.setHeader("Access-Control-Expose-Headers", "Idempotency-Key")
  res.setHeader("Idempotency-Key", idempotencyKey.idempotency_key)

  const completionStrat: AbstractCartCompletionStrategy = req.scope.resolve(
    "cartCompletionStrategy"
  )

  const { response_code, response_body } = await completionStrat.complete(
    id,
    idempotencyKey,
    req.request_context
  )

  res.status(response_code).json(response_body)
}
