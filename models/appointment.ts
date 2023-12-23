import { BaseWithIdNumber, PagingModel, ParamGet } from "./base";
import { Customer } from "./customer";
import { ServerAllocation } from "./serverAllocation";

export interface Appointment extends BaseWithIdNumber {
  appointedCustomer: string;
  dateAppointed: string;
  dateCheckedIn: string;
  dateCheckedOut: string;
  reason: string;
  note: string;
  techNote: string;
  saleNote: string;
  isCorrectPerson: boolean;
  status: string;
  serverAllocationId: number;
  inspectionReportFilePath: string;
  receiptOfRecipientFilePath: string;
  documentConfirm: boolean;
  customer: Customer;
  serverAllocation: ServerAllocation;
  purpose: string;
}

export interface AppointmentData extends PagingModel {
  data: Appointment[];
}

export interface ParamGetExtend extends ParamGet {
  Id: number;
}

export interface DocumentModelAppointment {
  number: string;
  customerName: string;
  customerPosition: string;
  qtName: string;
  position: string;
  location: string;
  username: string;
  isSendMS: boolean;
  good: boolean;
  guid: boolean;
  note: string;
  deviceCondition: string;
}

export interface AppointmentComplete {
  documentModel: DocumentModelAppointment;
  dateCheckedIn: string;
  dateCheckedOut: string;
  isCorrectPerson: boolean;
}

export interface AppointmentParseJson {
  Id: number;
}

export interface AppointmentCreateModel {
  appointedCustomer: string;
  dateAppointed: string;
  reason: string;
  note: string;
  serverAllocationId: number;
  requestUpgradeIds: number[];
  requestExpandId: number;
}
