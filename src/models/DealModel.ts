import Decimal from "decimal.js";
import { v4 as uuidv4 } from 'uuid';
import { SKUAccessibleProperties, SKUModel } from "./SKUModel";

export class DealModel {
  private _id: string;
  private _dateCreated: Date;
  private _dateUpdated?: Date;
  private _adjustedNetPrice?: string = undefined;
  private _netPrice?: string = undefined;


  dealName = ""
  skus: SKUModel[] = []
  precision = 2

  constructor(params?: Pick<DealModel, "dealName">) {
    this.dealName = params?.dealName ?? ""
    this._id = uuidv4()
    this._dateCreated = new Date()
    this.calculateTotal()
  }

  private calculateTotal = () => {

    this._netPrice = new Decimal(this.skus.reduce((acc, cur: Partial<SKUModel>) => {

      return new Decimal(acc).plus(cur?.netPrice ?? 0).toFixed(20)
    }, "0")).toFixed(this.precision)

    this._adjustedNetPrice = new Decimal(this.skus.reduce((acc, cur: Partial<SKUModel>) => {

      return new Decimal(acc).plus(cur?.adjustedNetPrice ?? 0).toFixed(20)
    }, "0")).toFixed(this.precision)

    this.update()
  }

  public addSKU = (sku: any) => {
    this.skus.push(sku)
    this.calculateTotal()
  }

  public removeSKU = (skuId: string) => {
    this.skus = this.skus.filter(({ id }) => id !== skuId)
    this.calculateTotal()
  }

  public updateSKU = (skuId: string, property: SKUAccessibleProperties, value: any) => {

    this.skus = this.skus.map(sku => {
      return skuId === sku.id ? this.makeUpdate(sku, property, value) : sku
    })

    this.calculateTotal()
  }

  private makeUpdate(sku: SKUModel, property: SKUAccessibleProperties, value: any): SKUModel {
    const _sku = new SKUModel(sku)
    switch (property) {
      case SKUAccessibleProperties.listPrice:
        _sku.setListPrice(value)
        break
      case SKUAccessibleProperties.quantity:
        _sku.setQuantity(value)
        break
      case SKUAccessibleProperties.adjustedPrice:
        _sku.setAdjustedPrice(value)
        break
      default:
    }

    return _sku
  }

  private update = () => {
    this._dateUpdated = new Date()
  }

  public get id(): string {
    return this._id;
  }

  public get dateCreated(): Date {
    return this._dateCreated;
  }

  public get dateUpdated(): Date | undefined {
    return this._dateUpdated;
  }
  public set dateUpdated(value: Date | undefined) {
    this._dateUpdated = value;
  }

  public get adjustedNetPrice(): string {
    return this?._adjustedNetPrice ?? "0";
  }
  public get netPrice(): string {
    return this?._netPrice ?? "0";
  }
}