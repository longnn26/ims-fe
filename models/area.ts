import { BaseWithIdNumber, PagingModel } from "./base";

export interface Area extends BaseWithIdNumber {
  name: string;
  rowCount: number;
  columnCount: number;
}

export interface AreaData extends PagingModel {
  data: Area[];
}

export interface AreaCreateModel {
  name: string;
  rowCount: number;
  columnCount: number;
}

export interface AreaUpdateModel {
  id: number;
  name: string;
  rowCount: number;
  columnCount: number;
}
