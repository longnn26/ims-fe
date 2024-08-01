import { PagingModel } from "./base";
import { StockWarehouse } from "./stockWarehouse";

export interface StockPickingType {
  id: string;
  name: string;
  code: string;
  barcode: string;
  totalPickingReady: number;
}

export interface StockPickingTypeInfo extends StockPickingType {
  warehouse: StockWarehouse;
}

export interface StockPickingTypePaging extends PagingModel {
  pageIndex: number;
  pageSize: number;
  totalPage: number;
  data: StockPickingTypeInfo[];
}
