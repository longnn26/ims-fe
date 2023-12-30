import { BaseWithIdNumber, PagingModel, ParamGet } from "./base";
import { ComponentObj } from "./component";

export interface ServerHardwareConfig extends BaseWithIdNumber {
  serverAllocationId: number;
  componentId: number;
  component: ComponentObj;
  description: string;
}

export interface SHCParamGet extends ParamGet {
  ServerAllocationId: number;
}

export interface ServerHardwareConfigData extends PagingModel {
  data: ServerHardwareConfig[];
}

export interface SHCCreateModel {
  descriptions: string;
  serverAllocationId: number;
  componentId: number;
}
export interface SHCUpdateModel {
  id: number;
  description: string;
  componentId: number;
  serverAllocationId: number;
}
