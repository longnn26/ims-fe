import { PagingModel } from "./base";
import { ProductProduct } from "./productProduct";
import { StockLocation } from "./stockLocation";
import { UomUom } from "./uomUom";

export interface StockMoveInfo {
  id: string;
  productProduct: ProductProduct;
  uomUom: UomUom;
  location: StockLocation;
  locationDest: StockLocation;
  pickingId: string;
  name: string;
  state: string;
  reference: string;
  descriptionPicking: string;
  productQty: number;
  productUomQty: number;
  quantity: number;
  reservationDate: string;
}
export interface StockMovePaging extends PagingModel {
  pageIndex: number;
  pageSize: number;
  totalPage: number;
  data: StockMoveInfo[];
}

export interface StockMoveCreate {
  productId: string;
  productUomId: string;
  pickingId: string;
  locationId: string;
  locationDestId: string;
  descriptionPicking?: string;
  productUomQty: number;
}

export interface StockMoveQuantityUpdate {
  id: string;
  quantity: number;
}
