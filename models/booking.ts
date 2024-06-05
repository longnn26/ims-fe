import { Base, PagingModel, ParamGet } from "./base";
import { User } from "./user";
import { Vehicle } from "./vehicle";

export interface BookingType {
  id: string;
  searchRequestId: string;
  driverId: string;
  checkInNote: string;
  checkOutNote: string;
  pickUpTime: string;
  dropOffTime: string;
  status: string;
  searchRequest: SearchRequest;
  driver: User;
  customer: User;
  driverLocation: string;
  bookingCancel: string;
  dateCreated: string;
}

export interface ImageBookingType {
  id: string;
  bookingId: string;
  booking: BookingType;
  imageUrl: string;
  //Front, Left, Behind, Right
  bookingImageType: string;
  //CheckOut, CheckIn
  bookingImageTime: string;
  dateCreated: string;
}
export interface BookingListData extends PagingModel {
  data: BookingType[];
}

export interface SearchRequest {
  id: string;
  customerId: string;
  driverId: string;
  customer: User;
  pickupLongitude: number;
  pickupLatitude: number;
  dropOffLongitude: number;
  dropOffLatitude: number;
  dropOffAddress: string;
  pickupAddress: string;
  bookingVehicle: Vehicle;
  customerBookedOnBehalf: any;
  price: number;
  distance: number;
  note: string;
  bookingPaymentMethod: string;
  bookingType: string;
  status: string;
  dateCreated: string;
}

export interface BookingCancelType {
  id: string;
  booking: BookingType;
  cancelPerson: User;
  imageUrls: any[];
  cancelReason: string;
  dateCreated: string;
}
