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
  userName: string;
  fullname?: string;
  email: string;
  address?: string;
  currenNoticeCount: number;
  positions: string[];
  roles: string[];
}

export interface UserTechData extends PagingModel {
  data: User[];
}

export interface UserData extends PagingModel {
  data: User[];
}

export interface UserCreateModel {
  userName: string,
  password: string,
  email: string,
  fullname?: string;
  address?: string;
  phoneNumber?: string;
  role: string;
}

export interface UserUpdateModel {
  id: string,
  password: string,
  email: string,
  fullname?: string;
  address?: string;
  phoneNumber?: string;
}

export interface UserUpdateRole {
  id: string,
  roles: string[];
}

export interface ChangePassword {
  email: string;
  currentPassword: string;
  newPassword: string;
}