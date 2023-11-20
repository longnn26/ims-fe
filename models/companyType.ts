import { BaseWithIdNumber, PagingModel } from "./base";

export interface CompanyType extends BaseWithIdNumber {
  name: string;
  description: string;
}
