import { BaseWithIdNumber, PagingModel, ParamGet } from "./base";

export interface RequestUpgrade extends BaseWithIdNumber {
  description: string;
  status: string;
  capacity: number;
  componentId: number;
  serverAllocationId: number;
}

export interface RUParamGet extends ParamGet {
  ServerAllocationId: number;
}

export interface RequestUpgradeData extends PagingModel {
  data: RequestUpgrade[];
}

export interface RequestUpgradeCreateModel {
  description: string;
  capacity: number;
  componentId: number;
  serverAllocationId: number;
}

export interface RequestUpgradeUpdateModel {
  id: number;
  description: string;
  capacity: number;
  componentId: number;
  serverAllocationId: number;
}
