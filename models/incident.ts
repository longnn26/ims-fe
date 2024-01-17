import { Appointment } from "./appointment";
import { BaseWithIdNumber, PagingModel, ParamGet } from "./base";
import { Customer } from "./customer";
import { Evaluator, Executor } from "./requestHost";
import { ServerAllocation } from "./serverAllocation";

export interface Incident extends BaseWithIdNumber {
  serverAllocationId: number;
  description;
  dateCreated: string;
  dateUpdated: string;
  customer: Customer;
  succeededAppointment: Appointment;
  serverAllocation: ServerAllocation;
  evaluator: Evaluator;
  executor: Executor;
  dateResolved: string;
  isResolvByClient: boolean;
  isResolved: boolean;
  solution: string;
}

export interface IncidentData extends PagingModel {
  data: Incident[];
}

export interface IncidentParam extends ParamGet {
  IsResolved?: string;
  ServerAllocationId?: number;
}

export interface IncidentResolveModel {
  solution: string;
}

export interface IncidentResolve extends BaseWithIdNumber {
  incidentResolvModel: IncidentResolveModel;
  dateCheckedIn: string;
  dateCheckedOut: string;
}

export interface IncidentCreateModel {
  serverAllocationId: number;
  description: string;
  isResolvByClient: boolean;
  pausingRequired: boolean;
}

export interface AppointmentIncidentCreateModel {
  appointedCustomer: string;
  serverAllocationId: number;
  incidentId: number;
  dateAppointed: string;
  note: string;
}

export interface IncidentParseJson {
  Id: number;
  ServerAllocationId: number;
}
