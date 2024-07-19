import { PagingModel } from "./base";
import { ProductAttributeValueInfo } from "./productAttributeValue";

export interface ProductAttribute {
  id: string;
  name: string;
  productAttributeValues: ProductAttributeValueInfo[]
}

export interface ProductAttributePaging extends PagingModel {
  pageIndex: number;
  pageSize: number;
  totalPage: number;
  data: ProductAttribute[];
}

export interface ProductAttributeInfo {
  id: string;
  name: string;
}

export interface ProductAttributeUpdate {
  id: string;
  name: string;
}
export interface ProductAttributeCreate {
  name: string;
}
