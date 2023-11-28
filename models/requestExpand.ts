import { BaseWithIdNumber, PagingModel } from "./base";
import { ComponentObj } from "./component";
import { Customer } from "./customer";

export interface RequestExpand extends BaseWithIdNumber {
  status: string;
  removalStatus: string;
  requestType: string;
  note: string;
  techNote: string;
  serverAllocationId: number;
  dateCreated: string;
  dateUpdated: string;
  size: string;
  customer: Customer;
}

export interface RequestExpandData extends PagingModel {
  data: RequestExpand[];
}
