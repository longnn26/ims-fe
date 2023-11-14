import { BaseWithIdNumber, PagingModel } from "./base";

export interface ComponentObj extends BaseWithIdNumber {
  name: string;
  description: string;
  unit: string;
  type: string;
}

export interface ComponentData extends PagingModel {
  data: ComponentObj[];
}

export interface ComponentCreateModel {
  name: string;
  description: string;
  unit: string;
  type: string;
}

export interface ComponentUpdateModel {
  id: number;
  name: string;
  description: string;
  unit: string;
  type: string;
}
