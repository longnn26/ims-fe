import { BaseWithIdNumber, PagingModel } from "./base";

export interface IpSubnet extends BaseWithIdNumber {
  firstOctet: number;
  secondOctet: number;
  thirdOctet: number;
  fourthOctet: number;
  note: string;
  parentNetworkId: number;
  prefixLength: number;
  subnetIds: IpSubnet[];
  children: IpSubnet[]
}

export interface IpSubnetData extends PagingModel {
  data: IpSubnet[];
}

export interface IpSubnetCreateModel {
  ipAddresss: string;
  prefixLength: number;
  note: string;
  ipSubnets: IpSubnet[];
}
