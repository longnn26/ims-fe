import { Appointment } from "./appointment";
import { Area } from "./area";
import { BaseWithIdNumber, PagingModel } from "./base";
import { Customer } from "./customer";
import { Rack } from "./rack";
import { Evaluator, Executor } from "./requestHost";
import { ServerAllocation } from "./serverAllocation";

export interface RequestExpand extends BaseWithIdNumber {
  status: string;
  removalStatus: string;
  requestType: string;
  note: string;
  techNote: string;
  serverAllocationId: number;
  dateCreated: string;
  dateUpdated: string;
  size: number;
  customer: Customer;
  succeededAppointment: Appointment;
  requestedLocation: RequestedLocation;
  serverAllocation: ServerAllocation;
  evaluator: Evaluator;
  executor: Executor;
  saleNote: string;
  chosenLocation: string;
}

export interface RequestExpandData extends PagingModel {
  data: RequestExpand[];
}

export interface RequestExpandCreateModel {
  forRemoval: boolean;
  note: string;
  saleNote: string;
  techNote: string;
  serverAllocationId: number;
  removalRequestDocument?: string;
  removalRequestDocumentFileName?: string;
}

export interface RequestExpandUpdateModel {
  id: number;
  size: number;
  note: string;
  techNote: string;
}

export interface SuggestLocation {
  area: Area;
  rack: Rack;
  position: number;
}

export interface RequestedLocation {
  rackId: number;
  startPosition: number;
}

export interface RequestExpandParseJson {
  Id: number;
}
