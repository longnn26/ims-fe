import { BaseWithIdNumber, PagingModel } from "./base";

export interface ServerAllocation extends BaseWithIdNumber {
  expectedSize: number;
  status: string;
  note: string;
  inspectorNote: string;
  inspectionRecordFilePath: string;
  receiptOfRecipientFilePath: string;
  customerId: number;
}

export interface ServerAllocationData extends PagingModel {
  data: ServerAllocation[];
}

export interface SACreateModel {
  expectedSize: number;
  note: string;
  customerId: number;
}
