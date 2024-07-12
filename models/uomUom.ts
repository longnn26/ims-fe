import { PagingModel } from "./base";

export interface UomUom {
  id: string;
  name: string;
  uomType: string;
}

export interface UomUomInfo extends UomUom {
  rounding: number;
  active: boolean;
  ratio: number;
}

export interface UomUomPaging extends PagingModel {
  pageIndex: number;
  pageSize: number;
  totalPage: number;
  data: UomUomInfo[];
}