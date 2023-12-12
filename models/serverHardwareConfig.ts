import { BaseWithIdNumber, PagingModel, ParamGet } from "./base";
import { ComponentObj } from "./component";

export interface ServerHardwareConfig extends BaseWithIdNumber {
  serverAllocationId: number;
  componentId: number;
  component: ComponentObj;
  descriptions: Descriptions[];
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
export interface Descriptions {
  serialNumber: string;
  model: string;
  capacity: number;
  description: string;
}
