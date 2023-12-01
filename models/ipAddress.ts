import { BaseWithIdNumber, PagingModel } from "./base";
import { IpSubnet } from "./ipSubnet";

export interface IpAddress extends BaseWithIdNumber {
  address: string;
  blocked: boolean;
  isReserved: boolean;
  purpose: string;
  ipSubnetId: number;
  ipSubnet: IpSubnet;
}

export interface IpAddressData extends PagingModel {
  data: IpAddress[];
}
