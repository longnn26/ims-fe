import { Base } from "./base";

export interface Category extends Base {
  name?: string;
  parentId?: string;
  children: Category[];
}

export interface CategoryCreate {
  id?: string;
  name?: string;
  parentCategoryId?: string;
}

export interface CategoryDetail extends Base {
  name: string;
}
