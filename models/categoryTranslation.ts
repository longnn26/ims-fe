import { Base, PagingModel, ParamGet } from "./base";
import { Language } from "./language";

export interface CategoryTranslation extends Base {
  name: string;
  description?: string;
  language: Language;
}

export interface CategoryTranslationCreate {
  id: string;
  languageId?: string;
  categoryId?: string;
  name: string;
  description: string;
}

export interface CategoryTranslationData extends PagingModel {
  data: CategoryTranslation[];
}

export interface ParamGetCateTrans extends ParamGet {
  categoryId: string;
}
