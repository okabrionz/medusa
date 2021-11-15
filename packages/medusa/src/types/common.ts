import { Transform } from "class-transformer"
import { IsDate, IsNumber, IsOptional, IsString } from "class-validator"
import { IsType } from "../utils/is-type"

export type PartialPick<T, K extends keyof T> = {
  [P in K]?: T[P]
}

export interface FindConfig<Entity> {
  select?: (keyof Entity)[]
  skip?: number
  take?: number
  relations?: string[]
  order?: "ASC" | "DESC"
}

export type PaginatedResponse = { limit: number; offset: number; count: number }

export class DateComparisonOperator {
  @IsOptional()
  @IsType([Date, String])
  lt?: Date | string

  @IsOptional()
  @IsType([Date, String])
  gt?: Date | string

  @IsOptional()
  @IsType([Date, String])
  gte?: Date | string

  @IsOptional()
  @IsType([Date, String])
  lte?: Date | string
}

export class StringComparisonOperator {
  @IsString()
  lt?: string

  @IsString()
  gt?: string

  @IsString()
  gte?: string

  @IsString()
  lte?: string
}

export class NumericalComparisonOperator {
  @IsNumber()
  lt?: number

  @IsNumber()
  gt?: number

  @IsNumber()
  gte?: number

  @IsNumber()
  lte?: number
}

export class AddressPayload {
  @IsOptional()
  @IsString()
  first_name: string
  @IsOptional()
  @IsString()
  last_name: string
  @IsOptional()
  @IsString()
  phone: string
  @IsOptional()
  metadata: object
  @IsOptional()
  @IsString()
  company: string
  @IsOptional()
  @IsString()
  address_1: string
  @IsOptional()
  @IsString()
  address_2: string
  @IsOptional()
  @IsString()
  city: string
  @IsOptional()
  @IsString()
  country_code: string
  @IsOptional()
  @IsString()
  province: string
  @IsOptional()
  @IsString()
  postal_code: string
}
