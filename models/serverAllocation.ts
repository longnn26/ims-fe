import { BaseWithIdNumber, PagingModel, ParamGet } from "./base";
import { Customer } from "./customer";
import { IpAddress } from "./ipAddress";

export interface ServerAllocation extends BaseWithIdNumber {
  status: string;
  power: number;
  name: string;
  serialNumber: string;
  note: string;
  customerId: number;
  customer: Customer;
  masterIp: IpAddress;
  masterIpAddress: string;
  techNote: string;
  partNumber: string;
  ipCount: number;
  location: string;
  inspectionRecordFilePath: string;
  receiptOfRecipientFilePath: string;
  removalReceiptFilePath: string;
  serverLocation: string;
}

export interface ServerAllocationData extends PagingModel {
  data: ServerAllocation[];
}

export interface SParamGet extends ParamGet {
  Status?: string;
}

export interface SACreateModel {
  name: string;
  serialNumber: string;
  power: number;
  note: string;
  customerId: number;
  partNumber: string;
}

export interface SAUpdateModel {
  id: number;
  name: string;
  power: number;
  partNumber: string;
  serialNumber: string;
  techNote: string;
  // note: string;
}

export interface MasterIpCreateModel {
  ipAddressId: number;
}

export interface IncidentCreateModel {
  serverAllocationId: number;
  description: string;
  isResolvByClient: boolean;
  pausingRequired: boolean;
}