import { PagingModel } from "./base";
import { ProductAttribute } from "./productAttribute";

export interface ProductTemplateAttributeLine {
  id: string;
  attributeId: string;
  productTmplId: string;
}

export interface ProductTemplateAttributeLineInfo extends ProductTemplateAttributeLine {
  productAttribute: ProductAttribute;
}

export interface ProductTemplateAttributeLinePaging extends PagingModel {
  pageIndex: number;
  pageSize: number;
  totalPage: number;
  data: ProductTemplateAttributeLineInfo[];
}

export interface ProductTemplateAttributeLineCreate {
  attributeId: string;
  productTmplId: string;
}
