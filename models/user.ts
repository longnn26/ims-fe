import { Base, PagingModel } from "./base";

export interface LoginResponse {
  access_token: string;
  tokenType: string;
  userId: string;
  expires_in: number;
  userName: string;
  email: string;
  phoneNumber?: string;
  currenNoticeCount: number;
}

export interface User extends Base {
  id: string;
  phoneNumber?: string;
  userName: string;
  fullname?: string;
  email: string;
  address?: string;
  currenNoticeCount: number;
  roles: string[];
}

export interface UserTechData extends PagingModel {
  data: User[];
}

export interface UserData extends PagingModel {
  data: User[];
}
