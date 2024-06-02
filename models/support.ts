import { Base, PagingModel, ParamGet } from "./base";
import { User } from "./user";

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
  handler?: User;
}

export interface SupportListData extends PagingModel {
  data?: SupportType[];
}

export interface SupportPause {
  supportId: string;
  note: string;
}
