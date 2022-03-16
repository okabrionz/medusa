import { EntityManager } from "typeorm"
import { MoneyAmount, ProductVariant } from ".."
import { MoneyAmountRepository } from "../repositories/money-amount"

export interface IPriceSelectionStrategy {
  /**
   * Calculates the tax amount for a given set of line items under applicable
   * tax conditions and calculation contexts.
   * @param items - the line items to calculate the tax total for
   * @param taxLines - the tax lines that applies to the calculation
   * @param calculationContext - other details relevant for the calculation
   * @return the tax total
   */

  calculateVariantPrice(
    variant: string | ProductVariant,
    context: PriceSelectionContext,
    manager?: MoneyAmountRepository
  ): Promise<PriceSelectionResult>
}

export function isPriceSelectionStrategy(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object: any
): object is IPriceSelectionStrategy {
  return typeof object.calculateVariantPrice === "function"
}

export type PriceSelectionContext = {
  cart_id?: string
  customer_id?: string
  quantity?: number
  region_id?: string
  currency_code?: string
  includeDiscountPrices?: boolean
}

export type PriceSelectionResult = {
  originalPrice: number | null
  calculatedPrice: number | null
  prices: MoneyAmount[] // prices is an array of all possible price for the input customer and region prices
}
