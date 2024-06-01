import { PagingModel } from "./base";

export interface Transaction {
  id: string;
  totalMoney: number;
  typeWalletTransaction: string;
  paymentType: any;
  status: string;
  dateCreated: string;
  linkedAccount: any;
  linkedAccountId: any;
}

export interface TransactionListData extends PagingModel {
  data: Transaction[];
}
