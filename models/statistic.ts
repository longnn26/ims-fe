import { BaseWithIdNumber, ParamGet } from "./base";

export interface Statistic extends BaseWithIdNumber {
    requestHosts: StatisticData;
    requestUpgrades: StatisticData;
    requestExpands: StatisticData;
    incidents: IncidentStatisticData;
    appointments: StatisticData;
}

export interface StatisticData {
    waiting: number;
    accepted: number;
    success: number;
    denied: number;
    failed: number;
}

export interface IncidentStatisticData {
    resolved: number;
    unresolved: number;
}

export interface StatisticParamGet extends ParamGet {
    ServerAllocationId?: number;
    RequestStatus?: string;
    Resolved?: boolean;
    StartDate?: string;
    EndDate?: string;
}
