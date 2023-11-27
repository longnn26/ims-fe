import { BaseWithIdNumber, PagingModel } from "./base";

export interface RequestExpand extends BaseWithIdNumber {
  status: string;
  removalStatus: string;
  requestType: string;
  note: string;
  techNote: string;
  serverAllocationId: number;
  dateCreated: string;
  dateUpdated: string;
  size: string;
}

export interface RequestExpandData extends PagingModel {
  data: RequestExpand[];
}
