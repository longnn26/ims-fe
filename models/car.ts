interface Base {
  id: string;
  dateCreated: string;
}

export interface BrandCarType extends Base {
  brandName: string;
  brandImg?: string;
}

export interface BrandCarCreateType {
  brandName: string;
  brandImg?: string;
}

export interface BrandCarUpdateType extends BrandCarCreateType {
  brandVehicleId: string;
}

export interface ModelCarCreateType {
  brandVehicleId: string;
  modelName: string;
}

export interface ModelCarUpdateType {
  modelVehicleId: string;
  modelName: string;
}

export interface ModelCarType extends Base {
  modelName: string;
}
