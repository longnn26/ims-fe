import { BaseWithIdNumber, PagingModel } from "./base";

export interface NotificationData extends PagingModel {
  data: Notification[];
}

export interface Notification extends BaseWithIdNumber {
  seen: boolean;
  action: string;
  title: string;
  body: string;
  data: any;
  typeModel: string;
}
