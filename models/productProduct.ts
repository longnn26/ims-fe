import { PagingModel } from "./base";

export interface ProductProduct{
  id: string;
  name: string;
  pvcs: Pvc[];
  qtyAvailable: number;
  uomUom: string;
}

export interface Pvc {
  attribute: string;
  value: string;
}

export interface ProductProductPaging extends PagingModel {
  pageIndex: number;
  pageSize: number;
  totalPage: number;
  data: ProductProduct[];
}
