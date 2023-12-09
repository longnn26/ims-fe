import { BaseWithIdNumber, PagingModel } from "./base";

export interface Customer extends BaseWithIdNumber {
  companyName: string;
  address: string;
  taxNumber: string;
  email: string;
  phoneNumber: string;
}

export interface CustomerData extends PagingModel {
  data: Customer[];
}

export interface CustomerCreateModel {
  companyName: string;
  address: string;
  taxNumber: string;
  email: string;
  phoneNumber: string;
}

export interface CustomerUpdateModel {
  id: number;
  companyName: string;
  address: string;
  taxNumber: string;
  email: string;
  phoneNumber: string;
}
