//content type
export enum ContentTypeEnum {
  MULTIPART = "multipart/form-data",
  APPLICATION_JSON_PATCH = "application/json-patch+json"
}

//support
export enum SupportTypeModelEnum {
  RECRUITMENT = "Recruitment",
  SUPPORT_ISSUE = "SupportIssue",
  BOOKING_ISSUE = "BookingIssue",
}

export enum SupportStatusEnum {
  NEW = "New",
  IN_PROCESS = "InProcess",
  SOLVED = "Solved",
  CANT_SOLVED = "Pause",
}

//emergency
export enum EmergencyStatusEnum {
  Pending = "Pending",
  Processing = "Processing",
  Solved = "Solved",
}

export enum EmergencyTypeEnum {
  Chat = "Chat",
  Call = "Call",
  Police = "Police",
}

//request
export enum RequestStatusEnum {
  Waiting = "Waiting",
  Success = "Success",
  Failure = "Failure",
}

//liên quan đến bấm action hiển thị detail
export enum CategoriesDetailEnum {
  SUPPORT_INFO = "SupportInfo",
  EMERGENCY_INFO = "EmergencyInfo",
  BOOKING_INFO = "BookingInfo",
  CUSTOMER_INFO = "CustomerInfo",
  DRIVER_INFO = "DriverInfo",
  ACCOUNT_INFO = "AccountInfo",
  IDENTITY_CARD_INFO = "IdentityCardInfo",
  VEHICLE_INFO = "VehicleInfo",
  DRIVING_LICENSE_INFO = "DrivingLicenseInfo",
  LINKED_ACCOUNT_INFO = "LinkedAccountInfo",
  REQUEST_INFO = "RequestInfo",
}
