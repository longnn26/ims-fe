import { Base, PagingModel, ParamGet } from "./base";

export interface Customer extends Base {
  id: string;
  phoneNumber: string;
  userName: string;
  name: string;
  email: string;
  address: string;
  avatar: string;
  gender: string;
}

export interface CustomerData extends PagingModel {
  data: Customer[];
}

export interface CusParam extends ParamGet {
  CompanyName?: string;
  SaleId?: string;
  IsDeleted?: boolean;
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
}

export interface Contacts {
  name: string;
  position: string;
  phoneNumber: string;
  email: string;
  forAppointment: boolean;
  cccd: string;
}

export interface ChangePassword {
  email: string;
  currentPassword: string;
  newPassword: string;
}
