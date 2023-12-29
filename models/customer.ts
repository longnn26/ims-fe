import { Base, PagingModel } from "./base";

export interface Customer extends Base {
  id: string;
  companyName: string;
  address: string;
  taxNumber: string;
  email: string;
  phoneNumber: string;
  representator: string;
  representatorPosition: string;
  contractNumber: string;
  contacts: Contacts[];
  isDeleted: boolean;
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
  representator: string;
  representatorPosition: string;
  contractNumber: string;
  contacts: Contacts[];
}

export interface CustomerUpdateModel {
  id: number;
  companyName: string;
  address: string;
  taxNumber: string;
  email: string;
  phoneNumber: string;
  representator: string;
  representatorPosition: string;
  contractNumber: string;
  contacts: Contacts[];
}

export interface Contacts {
  name: string;
  position: string;
  phoneNumber: string;
  email: string;
  forAppointment: boolean;
}
