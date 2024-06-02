export interface IdentityCardModel {
  id?: string;
  fullName: string;
  dob: string;
  gender: string;
  nationality: string;
  placeOrigin: string;
  placeResidence: string;
  personalIdentification: string;
  identityCardNumber: string;
  expiredDate: string;
}

export interface IdentityCardImageModel {
  identityCardId: string;
  file?: any;
  isFront: boolean;
  imageUrl?: string;
  id?: string;
}
