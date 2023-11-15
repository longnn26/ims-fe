export interface Base {
  id: string;
  dateCreated: string;
  dateUpdated: string;
}

export interface BaseWithIdNumber {
  id: number;
  dateCreated: string;
  dateUpdated: string;
}

export interface PagingModel {
  pageIndex: number;
  pageSize: number;
  totalPage: number;
  totalSize: number;
  pageSkip: number;
}

export interface ParamGet {
  PageIndex: number;
  PageSize: number;
  SortKey: string;
  SortOrder: string;
  SearchValue: string;
  DateStart: string;
  DateEnd: string;
}

export interface OptionType {
  value: string;
  label: string;
}
