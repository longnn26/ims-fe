import { Base } from "./base";
import { Language } from "./language";

export interface BlogTranslation extends Base {
  blogId: string;
  languageId: string;
  title: string;
  description: string;
  content: string;
  startPublishDate: string;
  endPublishDate: string;
  status: string;
  access: string;
  language: Language;
}

export interface BlogTranslationCreate {
  blogId: string;
  languageId: string;
  title: string;
  description: string;
  content: string;
  startPublishDate: string;
  endPublishDate: string;
  status: string;
  access: string;
}

export interface BlogTranslationUpdate {
  id: string;
  blogId: string;
  languageId: string;
  title: string;
  description: string;
  content: string;
  startPublishDate: string;
  endPublishDate: string;
  status: string;
  access: string;
}
