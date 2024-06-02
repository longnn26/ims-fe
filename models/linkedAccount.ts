import { User } from "./user";

export interface LinkedAccountType {
  id: string;
  user: User;
  accountNumber: string;
  type: string;
  brand: string;
  linkedImgUrl: string;
  dateCreated: string;
}
