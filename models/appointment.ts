import { BaseWithIdNumber, PagingModel } from "./base";

export interface Appointment extends BaseWithIdNumber {
  appointedCustomer: string;
  dateAppointed: string;
  dateCheckedIn: string;
  dateCheckedOut: string;
  reason: string;
  note: string;
  techNote: string;
  isCorrectPerson: boolean;
  status: string;
  serverAllocationId: number;
  inspectionReportFilePath: string;
  receiptOfRecipientFilePath: string;
}

export interface AppointmentData extends PagingModel {
  data: Appointment[];
}
