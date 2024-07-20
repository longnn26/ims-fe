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
}

export interface ProductTemplateInfo extends ProductTemplate {
  productCategory: ProductCategory;
  uomUom: UomUom;
}

export interface ProductTemplatePaging extends PagingModel {
  pageIndex: number;
  pageSize: number;
  totalPage: number;
  data: ProductTemplate[];
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
