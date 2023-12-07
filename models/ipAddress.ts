import { BaseWithIdNumber, PagingModel, ParamGet } from "./base";
import { IpSubnet } from "./ipSubnet";

export interface IpAddress extends BaseWithIdNumber {
  address: string;
  blocked: boolean;
  isReserved: boolean;
  purpose: string;
  reason: string;
  ipSubnetId: number;
  ipSubnet: IpSubnet;
}

export interface IpAddressData extends PagingModel {
  data: IpAddress[];
}

export interface IpAddressParamGet extends ParamGet {
  Address: string;
}
