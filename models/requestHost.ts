import { BaseWithIdNumber, PagingModel } from "./base";
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
  executor: string;
  customer: Customer;
  serverAllocation: ServerAllocation;
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
