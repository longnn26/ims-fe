import { User } from "./user";

export interface LinkedAccountType {
  id?: string;
  user?: User;
  accountNumber: string;
  type: string;
  brand: string;
  linkedImgUrl: string;
  dateCreated?: string;
}

export interface BankType {
  id: number;
  name: string;
  code: string;
  bin: string;
  shortName: string;
  logo: string;
  transferSupported: number;
  lookupSupported: number;
}

export interface ListBankType {
  data: BankType[];
}
