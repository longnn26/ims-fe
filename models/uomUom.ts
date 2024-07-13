import { PagingModel } from "./base";

export interface UomUom {
  id: string;
  name: string;
  uomType: string;
}

export interface UomUomInfo extends UomUom {
  categoryId: string,
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

export interface UomUomUpdateInfo {
  id: string;
  name?: string;
  rounding?: number;
  active?: boolean;
}

export interface UomUomUpdateFactor {
  id: string;
  factor: number;
}
