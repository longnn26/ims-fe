import { Base } from "./base";

export interface Resource extends Base {
  parentFolder: string;
  blogId: string;
  description: string;
  extension: string;
}
