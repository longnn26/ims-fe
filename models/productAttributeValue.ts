import { PagingModel } from "./base";

export interface ProductAttributeValue {
  id: string;
  name: string;
}

export interface ProductAttributeValueInfo extends ProductAttributeValue {
  attributeId: string;
}

export interface ProductAttributeValuePaging extends PagingModel {
  pageIndex: number;
  pageSize: number;
  totalPage: number;
  data: ProductAttributeValueInfo[];
}

export interface ProductAttributeValueUpdate {
  id: string;
  name?: string;
}

export interface ProductAttributeValueCreate {
  attributeId: string;
  name: string;
}
