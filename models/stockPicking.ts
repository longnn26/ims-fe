import { PagingModel } from "./base";
import { StockLocation } from "./stockLocation";
import { StockPickingType, StockPickingTypeInfo } from "./stockPickingType";
import { StockWarehouse } from "./stockWarehouse";

export interface StockPicking {
  id: string;
}

export interface StockPickingInfo extends StockPicking {
  pickingType: StockPickingTypeInfo;
  location: StockLocation;
  locationDest: StockLocation;
  name: string;
  state: string;
  note: string;
  scheduledDate: string;
  dateDeadline: string;
  dateDone: string;
}

export interface StockPickingPaging extends PagingModel {
  pageIndex: number;
  pageSize: number;
  totalPage: number;
  data: StockPickingInfo[];
}

export interface StockPickingCreate {
  partnerId?: string;
  scheduledDate?: string;
  pickingTypeId?: string;
  backorderId?: string;
  locationId?: string;
  locationDestId?: string;
  name: string;
  note?: string;
  dateDeadline?: string;
}
