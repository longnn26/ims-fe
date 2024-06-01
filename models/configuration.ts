export interface Configuration {
  baseFareFirst3km: BaseFareFirst3km;
  fareFerAdditionalKm: FareFerAdditionalKm;
  driverProfit: DriverProfit;
  appProfit: AppProfit;
  peakHours: PeakHours;
  nightSurcharge: NightSurcharge;
  waitingSurcharge: WaitingSurcharge;
  weatherFee: WeatherFee;
  customerCancelFee: CustomerCancelFee;
  id: string;
  dateCreated: string;
  dateUpdated: string;
}

export interface BaseFareFirst3km {
  price: number;
  isPercent: boolean;
}

export interface FareFerAdditionalKm {
  price: number;
  isPercent: boolean;
}

export interface DriverProfit {
  price: number;
  isPercent: boolean;
}

export interface AppProfit {
  price: number;
  isPercent: boolean;
}

export interface PeakHours {
  time: string;
  price: number;
  isPercent: boolean;
}

export interface NightSurcharge {
  time: string;
  price: number;
  isPercent: boolean;
}

export interface WaitingSurcharge {
  perMinutes: number;
  price: number;
  isPercent: boolean;
}

export interface WeatherFee {
  price: number;
  isPercent: boolean;
}

export interface CustomerCancelFee {
  price: number;
  isPercent: boolean;
}
