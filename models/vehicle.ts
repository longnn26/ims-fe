export interface VehicleType {
  id: string;
  licensePlate: string;
  brand: string;
  model: string;
  color: string;
  dateCreated: string;
  listVehicleImage?: VehicleTypeImage[];
}

export interface VehicleTypeImage {
  id: string;
  vehicleId: string;
  vehicle: VehicleType;
  imageUrl: string;
  vehicleImageType: string;
}
