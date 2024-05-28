import { Base, PagingModel, ParamGet } from "./base";

export interface SupportType {
  id?: string;
  bookingId?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  identityCardNumber?: string;
  birthPlace?: string;
  address?: string;
  drivingLicenseNumber?: string;
  drivingLicenseType?: string;
  msgContent?: string;
  supportStatus?: string;
  supportType: string;
  dateCreated?: string;
}

export interface SupportListData extends PagingModel {
  data?: SupportType[];
}

export interface SupportCantSolved {
  supportId: string;
  note: string;
}
