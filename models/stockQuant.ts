import { PagingModel } from "./base";
import { ProductProduct } from "./productProduct";
import { StockLocation } from "./stockLocation";

export interface StockQuantInfo {
  id: string;
  productProduct: ProductProduct;
  stockLocation: StockLocation;
  inventoryDate: string;
  quantity: number;
  inventoryQuantity: number;
  inventoryDiffQuantity: number;
  inventoryQuantitySet: boolean;
  uomUom: string;
}
export interface StockQuantPaging extends PagingModel {
  pageIndex: number;
  pageSize: number;
  totalPage: number;
  data: StockQuantInfo[];
}

export interface StockQuantCreate {
  productId: string;
  locationId: string;
  quantity: number;
}
