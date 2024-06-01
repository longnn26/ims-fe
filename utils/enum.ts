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
  CANT_SOLVED = "CantSolved",
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

//liên quan đến bấm action hiển thị detail
export enum CategoriesDetailEnum {
  EMERGENCY_INFO = "EmergencyInfo",
  BOOKING_INFO = "BookingInfo",
  CUSTOMER_INFO = "CustomerInfo",
  DRIVER_INFO = "DriverInfo",
}

export enum ProfileDetailEnum {
  ACCOUNT_INFO = "AccountInfo",
  IDENTITY_CARD_INFO = "IdentityCardInfo",
  VEHICLE_INFO = "VehicleInfo",
  DRIVING_LICENSE_INFO = "DrivingLicenseInfo",
  LINKED_ACCOUNT_INFO = "LinkedAccountInfo",
}
