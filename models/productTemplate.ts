import { PagingModel } from "./base";
import { ProductCategory } from "./productCategory";
import { UomUom } from "./uomUom";

export interface ProductTemplate {
  id: string;
  name: string;
  detailedType: string;
  tracking: string;
  description: string;
  active: boolean;
  imageUrl: string;
}

export interface ProductTemplateInfo extends ProductTemplate {
  productCategory: ProductCategory;
  uomUom: UomUom;
  totalVariant: number;
  qtyAvailable: number;
}

export interface ProductTemplatePaging extends PagingModel {
  pageIndex: number;
  pageSize: number;
  totalPage: number;
  data: ProductTemplateInfo[];
}

export interface ProductTemplateUpdate {
  id: string;
  categId?: string;
  uomId?: string;
  name?: string;
  detailedType?: string;
  tracking?: string;
  description?: string;
}

export interface ProductTemplateCreate {
  categId: string;
  uomId: string;
  name: string;
  detailedType: string;
  tracking: string;
  description: string;
}

export interface SuggestProductVariant {
  attributeName: string;
  attributeValue: string;
  productTemplateAttributeValueId: string;
}

export interface ProductVariantCreate {
  productTemplateId: string;
  ptavIds: string[];
}
