import { Appointment } from "./appointment";
import { BaseWithIdNumber, PagingModel } from "./base";
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

export interface IncidentResolveModel {
  solution: string;
}

export interface IncindentResolve {
  incidentResolvModel: IncidentResolveModel;
  dateCheckedIn: string;
  dateCheckedOut: string;
}
