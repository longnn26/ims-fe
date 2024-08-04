import { PagingModel } from "./base";

export interface UomUom {
  id: string;
  name: string;
  uomType: string;
}

export interface UomUomInfo extends UomUom {
  categoryId: string;
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
  // rounding?: number;
  active?: boolean;
}

export interface UomUomUpdateFactor {
  id: string;
  factor: number;
}
export interface UomUomUpdateType {
  id: string;
  uomType: string;
}

export interface UomUomCreate {
  categoryId: string;
  uomType?: string;
  name?: string;
  factor?: number;
  // rounding?: number;
  active?: boolean;
}
