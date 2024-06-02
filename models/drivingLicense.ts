export interface DrivingLicenseCardModel {
  drivingLicenseNumber: string;
  type: string;
  issueDate: string;
  expiredDate: string;
}

export interface DrivingLicenseImageCard {
  drivingLicenseId: string;
  file: any;
  isFront: boolean;
}
