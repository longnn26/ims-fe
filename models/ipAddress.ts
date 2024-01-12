import { BaseWithIdNumber, PagingModel, ParamGet } from "./base";
import { Customer } from "./customer";
import { IpSubnet } from "./ipSubnet";
import { IPAddresses } from "./requestHost";
import { ServerAllocation } from "./serverAllocation";

export interface IpAddress extends BaseWithIdNumber {
  address: string;
  capacity?: number;
  blocked: boolean;
  isReserved: boolean;
  purpose: string;
  reason: string;
  ipSubnetId: number;
  ipSubnet: IpSubnet;
  assignmentType: string;
  serverAllocation: ServerAllocation;
}

export interface IpAddressData extends PagingModel {
  data: IpAddress[];
}

export interface IpAddressParamGet extends ParamGet {
  ServerAllocationId?: number;
  IsAssigned?: boolean;
  IsAvailable?: boolean;
  Id?: number;
  Address?: string;
  AssignmentTypes?: string[];
  RequestHostId?: number;
  SubnetId?: number;
  Purposes?: string;
}

export interface IpAddressHistory extends BaseWithIdNumber {
  dateExecuted?: string;
  isBlock?: boolean;
  currentServerId?: number;
  reason?: string;
  currentServer: ServerAllocation;
  masterIp: IpAddress;
  dateCreated: string;
  dateUpdated: string;
  masterIpAddress: string;
  customer: Customer;
}

export interface IpAddressHistoryData extends PagingModel {
  data: IpAddressHistory[];
}
