import { BaseWithIdNumber, PagingModel, ParamGet } from "./base";
import { ComponentObj } from "./component";

export interface ServerHardwareConfig extends BaseWithIdNumber {
  information: string;
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
  information: string;
  capacity: number;
  serverAllocationId: number;
  componentId: number;
}
export interface SHCUpdateModel {
  id: number;
  information: string;
  capacity: number;
  componentId: number;
  serverAllocationId: number;
}
