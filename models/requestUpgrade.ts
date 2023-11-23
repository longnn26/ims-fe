import { BaseWithIdNumber, PagingModel, ParamGet } from "./base";
import { ComponentObj } from "./component";

export interface RequestUpgrade extends BaseWithIdNumber {
  information: string;
  status: string;
  capacity: number;
  componentId: number;
  component: ComponentObj;
  serverAllocationId: number;
}

export interface RUParamGet extends ParamGet {
  ServerAllocationId: number;
}

export interface RequestUpgradeData extends PagingModel {
  data: RequestUpgrade[];
}

export interface RequestUpgradeCreateModel {
  information: string;
  capacity: number;
  componentId: number;
  serverAllocationId: number;
}

export interface RequestUpgradeUpdateModel {
  id: number;
  information: string;
  capacity: number;
  componentId: number;
  component: ComponentObj;
  serverAllocationId: number;
}

export interface RUAppointmentParamGet extends ParamGet {
  Id: number;
}
