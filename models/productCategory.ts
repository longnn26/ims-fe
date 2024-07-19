import { PagingModel } from "./base";

export interface ProductCategory {
  id: string;
  name: string;
  completeName: string;
  parentPath: string;
  removalStrategyId: string;
}

export interface ProductCategoryInfo extends ProductCategory {
  parentCategory?: ProductCategory
}

export interface ProductCategoryPaging extends PagingModel {
  pageIndex: number;
  pageSize: number;
  totalPage: number;
  data: ProductCategoryInfo[];
}

export interface ProductCategoryUpdateInfo {
  id: string;
  name: string;
  removalStrategyId: string;
}

export interface ProductCategoryUpdateParent {
  id: string;
  parentId: string;
}

export interface ProductCategoryCreate {
  name: string;
  removalStrategyId: string;
}
