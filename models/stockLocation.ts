import { PagingModel } from "./base";

export interface StockLocation {
  id: string;
  name: string;
  completeName: string;
  parentPath: string;
  barcode: string;
  usage: string;
}
