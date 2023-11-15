import { BaseWithIdNumber, PagingModel } from "./base";

export interface Customer extends BaseWithIdNumber {
  companyName: string;
  address: string;
  taxNumber: string;
  email: string;
  phoneNumber: string;
  customerName: string;
  companyTypeId: number;
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
  customerName: string;
  companyTypeId: number;
}

export interface CustomerUpdateModel {
  id: number;
  companyName: string;
  address: string;
  taxNumber: string;
  email: string;
  phoneNumber: string;
  customerName: string;
  companyTypeId: number;
}