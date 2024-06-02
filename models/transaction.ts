import { PagingModel } from "./base";
import { LinkedAccountType } from "./linkedAccount";

export interface TransactionType {
  id: string;
  totalMoney: number;
  typeWalletTransaction: string;
  paymentType: string | null;
  status: string;
  dateCreated: string;
  linkedAccount: LinkedAccountType;
  linkedAccountId: string;
}

export interface TransactionListData extends PagingModel {
  data: TransactionType[];
}

export interface WithdrawFundsId {
  withdrawFundsId: string;
}
