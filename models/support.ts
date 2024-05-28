import { Base, PagingModel, ParamGet } from "./base";

export interface Support {
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
  supportType?: string;
  dateCreated?: string;
}

export interface SupportData extends PagingModel {
  data: Support[];
}

export interface SupportCantSolved {
  supportId: string;
  note: string;
}

export enum SupportTypeModel {
  RECRUITMENT = "Recruitment",
  SUPPORT_ISSUE = "SupportIssue",
  BOOKING_ISSUE = "BookingIssue",
}

export enum SupportStatus {
  NEW = "New",
  IN_PROCESS = "InProcess",
  SOLVED = "Solved",
  CANT_SOLVED = "CantSolved",
}
