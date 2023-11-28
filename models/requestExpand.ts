import { Appointment } from "./appointment";
import { BaseWithIdNumber, PagingModel } from "./base";
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
  succeededAppointment: Appointment;
}

export interface RequestExpandData extends PagingModel {
  data: RequestExpand[];
}

export interface RequestExpandUpdateModel {
  id: number;
  size: number;
  note: string;
  techNote: string;
}
