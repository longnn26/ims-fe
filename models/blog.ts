import { UploadFile } from "antd";
import { Base, PagingModel, ParamGet } from "./base";
import { BlogTranslation } from "./blogTranslation";
import { Resource } from "./resource";
import { User } from "./user";
import { Category } from "./category";

export interface Blog extends Base {
  name: string;
  user: User;
  blogTranslations: BlogTranslation[];
  resources: Resource[];
}

export interface BlogData extends PagingModel {
  data: Blog[];
}

export interface BlogCreateOrEdit {
  id?: string;
  name: string;
  resources: Resource[];
  fileList: UploadFile[];
}

export interface BlogCategory extends Base {
  category: Category;
}

export interface AssignCategory {
  blogId: string;
  categoryIds: string[];
}

export interface BlogPublic {
  blogId: string;
  blogName: string;
  title: string;
  description: string;
  imgUrl: string;
  dateCreated: string;
  dateUpdated: string;
}

export interface ParamGetBlogPublic extends ParamGet {
  UrlFilter?: string;
  LanguageId: string;
}

export interface BlogGetContentRqPublic {
  BlogId: string;
  LanguageId: string;
}

export interface BlogContentPublic {
  blogName: string;
  imgUrls: string[];
  title: string;
  description: string;
  content: string;

}

export interface BlogPublicData extends PagingModel {
  data: BlogPublic[];
}
