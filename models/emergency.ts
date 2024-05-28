import { Base, PagingModel, ParamGet } from "./base";
import { Booking } from "./booking";
import { User } from "./user";

export interface Emergency {
  id: string
  sender: User
  handler: User
  booking: Booking
  note: string
  solution: string
  status: string
  emergencyType: string
}

export enum EmergencyStatus {
  Pending = "Pending",
  Processing = "Processing",
  Solved = "Solved",
}

export enum EmergencyType {
  Chat = "Chat",
  Call = "Call",
  Police = "Police",
}
