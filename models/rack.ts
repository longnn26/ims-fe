import { BaseWithIdNumber, PagingModel } from "./base";
import { ServerAllocation } from "./serverAllocation";

export interface Rack extends BaseWithIdNumber {
  maxPower: number;
  currentPower: number;
  column: number;
  row: number;
  size: number;
  areaId: number;
}

export interface RackData extends PagingModel {
  data: Rack[];
}

export interface RowInArea {
  id: number;
  data: Rack[];
}

export interface RackCreateModel {
  maxPower: number;
  currentPower: number;
  column: number;
  row: number;
  size: number;
  areaId: number;
}

export interface RackUpdateModel {
  id: number;
  maxPower: number;
  currentPower: number;
  column: number;
  row: number;
  size: number;
  areaId: number;
}

export interface RackMap {
  id: number;
  position: number;
  rackId: number;
  serverAllocation: ServerAllocation;
}
