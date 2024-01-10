import { Statistic, StatisticParamGet } from "@models/statistic";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getData = async (token: string, params: StatisticParamGet): Promise<Statistic> => {
    const response = await httpClient.get({
        token: token,
        url: apiLinks.statistic.get,
        params: params,
    });
    return response.data;
};

const getDataByMonth = async (token: string, params: StatisticParamGet): Promise<Statistic> => {
    const response = await httpClient.get({
        token: token,
        url: apiLinks.statistic.getByMonth,
        params: params,
    });
    return response.data;
};

const statistic = {
    getData,
    getDataByMonth,
}

export default statistic;