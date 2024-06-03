export interface DrivingLicenseCardModel {
  drivingLicenseNumber: string;
  type: string;
  issueDate: string;
  expiredDate: string;
  id?: string;
}

export interface DrivingLicenseImageCard {
  drivingLicenseId: string;
  file?: any;
  isFront: boolean;
  imageUrl?: string;
  id?: string;
}
