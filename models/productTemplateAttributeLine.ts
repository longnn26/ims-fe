import { PagingModel } from "./base";
import { ProductAttribute } from "./productAttribute";
import { ProductAttributeValue } from "./productAttributeValue";

export interface ProductTemplateAttributeLine {
  id: string;
  attributeId: string;
  productTmplId: string;
}

export interface ProductTemplateAttributeValue {
  id: string;
  productAttributeValue: ProductAttributeValue;
}

export interface ProductTemplateAttributeLineInfo
  extends ProductTemplateAttributeLine {
  productAttribute: ProductAttribute;
  productTemplateAttributeValues: ProductTemplateAttributeValue[];
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

export interface ProductTemplateAttributeValuesUpdate {
  attributeLineId: string;
  productAttributeValueIds: string[];
}
