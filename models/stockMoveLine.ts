import { PagingModel } from "./base";

export interface StockMoveLineInfo {
  id: string;
  reference: string;
  productProduct: string;
  uomUom: string;
  state: string;
  quantityProductUom: number;
  quantity: number;
  location: string;
  locationDest: string;
  writeDate: string;
}
export interface StockMoveLinePaging extends PagingModel {
  pageIndex: number;
  pageSize: number;
  totalPage: number;
  data: StockMoveLineInfo[];
}
