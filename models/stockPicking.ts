import { PagingModel } from "./base";
import { StockLocation } from "./stockLocation";
import { StockPickingType, StockPickingTypeInfo } from "./stockPickingType";
import { StockWarehouse } from "./stockWarehouse";

export interface StockPicking {
  id: string;
}

export interface StockPickingInfo extends StockPicking {
  partnerId?: string;
  pickingTypeId?: string;
  pickingType: StockPickingTypeInfo;
  location: StockLocation;
  locationId: string;
  locationDest: StockLocation;
  locationDestId?: string;
  name: string;
  state: string;
  note: string;
  scheduledDate: string;
  dateDeadline: string;
  dateDone: string;
  backorder?: StockPickingInfo;
  backorderId?: string;
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

export interface StockPickingReceipt {
  partnerId?: string;
  scheduledDate?: string;
  pickingTypeId?: string;
  locationDestId?: string;
  name: string;
  note?: string;
  dateDeadline?: string;
}

export interface StockPickingReceiptUpdate {
  scheduledDate?: string;
  locationDestId?: string;
  note?: string;
  dateDeadline?: string;
}

export interface StockPickingDeliveryOrder {
  partnerId?: string;
  scheduledDate?: string;
  pickingTypeId?: string;
  locationId?: string;
  name: string;
  note?: string;
  dateDeadline?: string;
}

export interface StockPickingDeliveryOrderUpdate {
  scheduledDate?: string;
  locationId?: string;
  note?: string;
  dateDeadline?: string;
}

export interface StockPickingInternalTransfer {
  locationId?: string;
  locationDestId?: string;
  partnerId?: string;
  scheduledDate?: string;
  pickingTypeId?: string;
  name: string;
  note?: string;
  dateDeadline?: string;
}

export interface StockPickingInternalTransferUpdate {
  locationId?: string;
  locationDestId?: string;
  scheduledDate?: string;
  note?: string;
  dateDeadline?: string;
}
