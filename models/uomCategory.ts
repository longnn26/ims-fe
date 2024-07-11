import { BaseWithIdNumber, PagingModel } from "./base";

export interface UomCategory {
  id: string;
  name: string;
}

export interface UomCategoryData extends PagingModel {
  data: UomCategory[];
}
