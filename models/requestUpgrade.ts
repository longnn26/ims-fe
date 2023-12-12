import { Appointment } from "./appointment";
import { BaseWithIdNumber, PagingModel, ParamGet } from "./base";
import { ComponentObj } from "./component";
import { Customer } from "./customer";
import { Evaluator, Executor } from "./requestHost";

export interface RequestUpgrade extends BaseWithIdNumber {
  status: string;
  requestType: string;
  componentId: number;
  customer: Customer;
  component: ComponentObj;
  descriptions: Descriptions[];
  serverAllocationId: number;
  succeededAppointment: Appointment;
  note: string;
  saleNote: string;
  techNote: string;
  evaluator: Evaluator;
  executor: Executor;
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

export interface Descriptions {
  serialNumber: string;
  model: string;
  capacity: number;
  description: string;
}
