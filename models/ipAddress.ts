import { UserInfo } from "os";
import { BaseWithIdNumber, PagingModel, ParamGet } from "./base";
import { Customer } from "./customer";
import { IpSubnet } from "./ipSubnet";
import { IPAddresses } from "./requestHost";
import { ServerAllocation } from "./serverAllocation";
import { User } from "./user";

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

export interface IpAddressHistory {
  currentServer: ServerAllocation;
  currentServerId: number;
  dateExecuted: string;
  executor: User;
  ipAddress: IpAddress;
  isBlock: boolean;
  reason: string;
}

export interface IpAddressHistoryData extends PagingModel {
  data: IpAddressHistory[];
}
