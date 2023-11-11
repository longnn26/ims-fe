import { Base } from "./base";

export interface Menu extends Base {
  name: string;
  normalizedName: string;
}

export interface AssignCategory {
  normalizedName: string;
  categoryIds: string[];
}

export interface MenuRequestPublic {
  languageId: string;
  normalizedName: string;
}

export interface MenuItemPublic {
  categoryId: string;
  name: string;
  children: MenuItemPublic[];
}

export interface MenuItemPublicAntd {
  key: React.Key;
  label: string;
  // categoryId: string;
  name: string;
  children?: MenuItemPublicAntd[] | null;
}
