import { Base, PagingModel } from "./base";

export interface LoginResponse {
  access_token: string;
  tokenType: string;
  userId: string;
  expires_in: number;
  userName: string;
  phoneNumber?: string;
  currenNoticeCount: number;
}

export interface User extends Base {
  phoneNumber?: string;
  userName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  address?: string;
  fullname?: string;
  currenNoticeCount: number;
}

export interface UserTechData extends PagingModel {
  data: User[];
}
