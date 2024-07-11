import { BaseWithIdNumber, PagingModel } from "./base";
import { UomUom } from "./uomUom";

export interface UomCategory {
  id: string;
  name: string;
  uomUoms: UomUom[]
}

export interface UomCategoryPaging extends PagingModel {
  pageIndex: number;
  pageSize: number;
  totalPage: number;
  data: UomCategory[];
}
