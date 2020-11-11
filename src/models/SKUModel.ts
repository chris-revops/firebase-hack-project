import { v4 as uuidv4 } from 'uuid';
import { Decimal } from 'decimal.js';

Decimal.set({
  precision: 20,
  rounding: Decimal.ROUND_HALF_EVEN,
})

export enum SKUAccessibleProperties {
  listPrice = "listPrice",
  adjustedPrice = "adjustedPrice",
  name = "name",
  quantity = "quantity",
}

export class SKUModel {
  id = ""
  name = ""
  quantity?: number = undefined
  defaultQuantity: number = 1
  listPrice: string
  monthlyPrice?: string = undefined
  annualPrice?: string = undefined
  netPrice?: string = undefined
  adjustedPrice?: string = undefined
  adjustedMonthlyPrice?: string = undefined
  adjustedAnnualPrice?: string = undefined
  adjustedNetPrice?: string = undefined
  fractionDigits: number = 2
  currency: string | null = null

  constructor({ id,
    name = "",
    quantity = undefined,
    defaultQuantity = 1,
    listPrice = "0",
    monthlyPrice = undefined,
    annualPrice = undefined,
    netPrice = undefined,
    adjustedPrice = undefined,
    adjustedMonthlyPrice = undefined,
    adjustedAnnualPrice = undefined,
    adjustedNetPrice = undefined,
    fractionDigits = 2,
    currency = null }: Partial<SKUModel>) {
    this.id = id ?? uuidv4()
    this.listPrice = listPrice ?? "0"
    this.name = name ?? ""
    this.defaultQuantity = defaultQuantity
    this.currency = currency
    this.quantity = quantity
    this.defaultQuantity = defaultQuantity
    this.listPrice = listPrice
    this.monthlyPrice = monthlyPrice
    this.annualPrice = annualPrice
    this.netPrice = netPrice
    this.adjustedPrice = adjustedPrice
    this.adjustedMonthlyPrice = adjustedMonthlyPrice
    this.adjustedAnnualPrice = adjustedAnnualPrice
    this.adjustedNetPrice = adjustedNetPrice
    this.fractionDigits = fractionDigits
    this.currency = currency

    this.calculateListPrice()
    this.calculateAdjustedPrice()
  }

  public calculateListPrice = (term = 12) => {
    if (!this.listPrice) {
      throw Error("Calculation is not possible no list price is available")
    }

    const monthlyBasePrice = new Decimal(this.listPrice).times(this.getQuantity())
    this.monthlyPrice = monthlyBasePrice.toFixed(this.fractionDigits)
    this.annualPrice = monthlyBasePrice.times(12).toFixed(this.fractionDigits)
    this.netPrice = monthlyBasePrice.times(term).toFixed(this.fractionDigits)
  }

  public calculateAdjustedPrice = (term = 12) => {
    const monthlyAdjustedPrice = new Decimal(this.adjustedPrice ?? this.listPrice ?? 0).times(this.getQuantity())
    this.adjustedMonthlyPrice = monthlyAdjustedPrice.toFixed(this.fractionDigits)
    this.adjustedAnnualPrice = monthlyAdjustedPrice.times(12).toFixed(this.fractionDigits)
    this.adjustedNetPrice = monthlyAdjustedPrice.times(term).toFixed(this.fractionDigits)
  }

  public getQuantity(): number {
    return this?.quantity ?? this.defaultQuantity
  }

  public setListPrice(value: string) {
    this.listPrice = value
    this.calculateListPrice()
  }
  public setDefaultQuantity(value: number) {
    this.quantity = value
    this.calculateListPrice()
  }
  public setAdjustedPrice(value: string) {
    this.adjustedPrice = value
    this.calculateAdjustedPrice()
  }
  public setQuantity(value: number | string) {
    this.quantity = Number(value)
    this.calculateListPrice()
    this.calculateAdjustedPrice()
  }
}


