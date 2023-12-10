import { BaseWithIdNumber, PagingModel, ParamGet } from "./base";

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
}

export interface AppointmentData extends PagingModel {
  data: Appointment[];
}

export interface ParamGetExtend extends ParamGet {
  Id: number;
}

export interface AppointmentComplete {
  dateCheckedIn: string;
  dateCheckedOut: string;
  techNote: string;
  isCorrectPerson: boolean;
}
