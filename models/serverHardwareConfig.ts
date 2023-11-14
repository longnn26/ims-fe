import { BaseWithIdNumber, PagingModel, ParamGet } from "./base";

export interface ServerHardwareConfig extends BaseWithIdNumber {
  description: string;
  capacity: number;
  serverAllocationId: number;
  componentId: number;
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
