import { PagingModel } from "./base";

export interface ProductProduct{
  id: string;
  name: string;
  pvcs: Pvc[];
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
