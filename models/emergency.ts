import { Base, PagingModel, ParamGet } from "./base";
import { Booking } from "./booking";
import { User } from "./user";

export interface EmergencyType extends Base {
  sender: User;
  handler: User;
  booking: Booking;
  note: string;
  solution: string;
  status: string;
  emergencyType: string;
  senderAddress: string;
  senderLatitude: number;
  senderLongitude: number;
  isStopTrip: boolean;
  bookingCancelReason?: string;
  dateCreated: string;
}

export interface EmergencyListData extends PagingModel {
  data: EmergencyType[];
}

export interface EmergencySolved {
  emergencyId: string;
  solution: string;
  bookingCancelReason: string;
  isStopTrip: boolean;
}
