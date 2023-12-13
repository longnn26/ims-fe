import { BaseWithIdNumber, PagingModel, ParamGet } from "./base";
import { ComponentObj } from "./component";

export interface ServerHardwareConfig extends BaseWithIdNumber {
  serverAllocationId: number;
  componentId: number;
  component: ComponentObj;
  descriptions: DescriptionsObj[];
}

export interface SHCParamGet extends ParamGet {
  ServerAllocationId: number;
}

export interface ServerHardwareConfigData extends PagingModel {
  data: ServerHardwareConfig[];
}

export interface SHCCreateModel {
  descriptions: DescriptionsObj[];
  serverAllocationId: number;
  componentId: number;
}
export interface SHCUpdateModel {
  id: number;
  descriptions: DescriptionsObj[];
  componentId: number;
  serverAllocationId: number;
}
export interface DescriptionsObj {
  serialNumber: string;
  model: string;
  capacity: number;
  description: string;
}
