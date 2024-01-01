import { BaseWithIdNumber, PagingModel, ParamGet } from "./base";
import { IpSubnet } from "./ipSubnet";

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
}
