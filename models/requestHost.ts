import { BaseWithIdNumber, PagingModel, ParamGet } from "./base";
import { Customer } from "./customer";
import { ServerAllocation } from "./serverAllocation";

export interface RequestHost extends BaseWithIdNumber {
  quantity: number;
  note: string;
  saleNote: string;
  techNote: string;
  isRemoval: boolean;
  type: string;
  status: string;
  inspectionReportFilePath: string;
  requestType: string;
  dateCreated: string;
  dateUpdated: string;
  serverAllocationId: number;
  executor: Executor;
  customer: Customer;
  serverAllocation: ServerAllocation;
  evaluator: Evaluator;
}

export interface RequestHostData extends PagingModel {
  data: RequestHost[];
}

export interface RequestHostUpdateModel {
  id: number;
  note: string;
  saleNote: string;
  techNote: string;
  quantity: number;
  type: string;
}
export interface Evaluator {
  id: number;
  phoneNumber: string;
  userName: string;
  fullname: string;
  email: number;
  address: string;
}
export interface Executor {
  id: number;
  phoneNumber: string;
  userName: string;
  fullname: string;
  email: number;
  address: string;
}

export interface RUIpAdressParamGet extends ParamGet {
  Id: number;
}

export interface RequestHostCompleteModel {
  number: string;
  customerName: string;
  customerPosition: string;
  qtName: string;
  position: number;
  location: string;
  good: boolean;
  note: string;
}

export interface RequestHostRejectModel {
  note: string;
  saleNote: string;
  techNote: string;
}
