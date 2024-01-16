import { BaseWithIdNumber, PagingModel, ParamGet } from "./base";
import { Rack } from "./rack";

export interface Location extends BaseWithIdNumber {
    isReserved: boolean;
    isServer: boolean;
    position: number;
    rackId: number;
    rack: Rack;
}

export interface LocationData extends PagingModel {
    data: Location[];
}

export interface LocationParamGet extends ParamGet {
    RackId?: number;
    Size?: number;
    IsReserved?: boolean;
}