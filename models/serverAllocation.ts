import { BaseWithIdNumber, PagingModel } from "./base";

export interface ServerAllocation extends BaseWithIdNumber {
  status: string;
  power: number;
  name: string;
  serialNumber: string;
  note: string;
  customerId: number;
}

export interface ServerAllocationData extends PagingModel {
  data: ServerAllocation[];
}

export interface SACreateModel {
  name: string;
  serialNumber: string;
  power: number;
  note: string;
  customerId: number;
}

export interface SAUpdateModel {
  id: number;
  name: string;
  power: number;
  note: string;
}
