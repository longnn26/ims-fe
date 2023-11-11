import { UploadFile } from "antd";
import { Base, PagingModel } from "./base";

export interface Language extends Base {
  id: string;
  name: string;
  description: string;
  image: string;
  status: string;
  parentFolder: string;
}

export interface LanguagePublic extends Base {
  id: string;
  name: string;
  description: string;
  image: string;
  parentFolder: string;
}

export interface LanguageDataPublic extends PagingModel {
  data: LanguagePublic[];
}

export interface LanguageData extends PagingModel {
  data: Language[];
}

export interface LanguageCreateOrEdit {
  id?: string;
  name: string;
  description: string;
  image: string;
  status: string;
  fileList: UploadFile[];
}
