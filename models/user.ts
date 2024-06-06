import { Base, PagingModel } from "./base";

export interface LoginResponse {
  access_token: string;
  tokenType: string;
  userId: string;
  expiresIn: number;
  userName: string;
  email: string;
  phoneNumber?: string;
  currenNoticeCount: number;
  roles: string[];
}

export interface User extends Base {
  id: string;
  phoneNumber?: string;
  userName?: string;
  fullname?: string;
  email?: string;
  address?: string;
  currenNoticeCount: number;
  roles?: string[];
  role?: string;
  name: string;
  star?: number;
  priority?: number;
  avatar?: string;
  gender?: string;
  dob?: string;
  isPublicGender?: boolean;
  isActive?: boolean;
}

export interface UserListData extends PagingModel {
  data: User[];
}

export interface UserData extends PagingModel {
  data: User[];
}

export interface UserCreateModel {
  userName: string;
  password: string;
  email: string;
  fullname?: string;
  address?: string;
  phoneNumber?: string;
  role: string;
}

export interface UserUpdateModel {
  id: string;
  password: string;
  email: string;
  fullname?: string;
  address?: string;
  phoneNumber?: string;
}

export interface UserUpdateRole {
  id: string;
  roles: string[];
}

export interface UserId {
  userId: string;
}

export interface DriverCreateModel {
  name: string;
  userName: string;
  email: string;
  phoneNumber: string;
  address: string;
  gender: string;
  dob: string;
  file: any;
}

export interface RegisterDriverByAdminModel {
    name: string;
    userName: string;
    email: string;
    phoneNumber: string;
    address: string;
    gender: string;
    dob: string;
    file: any;
    drivingLicenseNumber: string;
    type: string; //type này là type của driving license
    issueDate: string;
    drivingLicenseExpiredDate: string;
    nationality: string;
    placeOrigin: string;
    placeResidence: string;
    personalIdentification: string;
    identityCardNumber: string;
    identityCardExpiredDate: string;
}