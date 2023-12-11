import { Base, PagingModel } from "./base";

export interface LoginResponse {
  access_token: string;
  tokenType: string;
  userId: string;
  expires_in: number;
  userName: string;
  email: string;
  phoneNumber?: string;
}

export interface User extends Base {
  phoneNumber?: string;
  userName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  address?: string;
  fullname?: string;
}

export interface UserTechData extends PagingModel {
  data: User[];
}
