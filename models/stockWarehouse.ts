import { PagingModel } from "./base";
import { StockLocation } from "./stockLocation";
import { StockPickingType } from "./stockPickingType";

export interface StockWarehouse {
  id: string;
  name: string;
  code: string;
}

export interface StockWarehousePaging extends PagingModel {
  pageIndex: number;
  pageSize: number;
  totalPage: number;
  data: StockWarehouseInfo[];
}

export interface StockWarehouseInfo extends StockWarehouse {
  viewLocation: StockLocation;
  lotStock: StockLocation;
  whInputStockLoc: StockLocation;
  whQcStockLoc: StockLocation;
  whOutputStockLoc: StockLocation;
  whPackStockLoc: StockLocation;
  stockPickingTypes: StockPickingType[]
}

export interface StockWarehouseUpdate {
  id: string;
  name: string;
  code: string;
}
export interface StockWarehouseCreate {
  name: string;
  code: string;
}
