import { BaseWithIdNumber, PagingModel, ParamGet } from "./base";
import { ComponentObj } from "./component";

export interface ServerHardwareConfig extends BaseWithIdNumber {
  description: string;
  capacity: number;
  serverAllocationId: number;
  componentId: number;
  component: ComponentObj;
}

export interface SHCParamGet extends ParamGet {
  ServerAllocationId: number;
}

export interface ServerHardwareConfigData extends PagingModel {
  data: ServerHardwareConfig[];
}

export interface SHCCreateModel {
  description: string;
  capacity: number;
  serverAllocationId: number;
  componentId: number;
}
export interface SHCUpdateModel {
  id: number;
  description: string;
  capacity: number;
  componentId: number;
  serverAllocationId: number;
}
