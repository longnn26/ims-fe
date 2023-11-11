import { Base } from "./base";

export interface LoginResponse {
  access_token: string;
  tokenType: string;
  userId: string;
  expiresIn: number;
  userName: string;
  phoneNumber?: string;
}

export interface User extends Base {
  phoneNumber?: string;
  userName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  address?: string;
}
