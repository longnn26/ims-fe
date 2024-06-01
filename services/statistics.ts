import { ParamGet } from "@models/base";
import { Statistic } from "@models/statistics";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getOverviewStatistics = async (token: string): Promise<Statistic> => {
  const response = await httpClient.get({
    url: `${apiLinks.statistics.getOverview}`,
    token: token,
  });
  return response.data;
};

const getAdminRevenueMonthlyIncome = async (
  token: string,
  year: number
): Promise<Statistic> => {
  const response = await httpClient.put({
    url: `${apiLinks.statistics.getAdminRevenueMonthlyIncome}/${year}`,
    token: token,
  });
  return response.data;
};

const getAdminProfitMonthlyIncome = async (
  token: string,
  year: number
): Promise<Statistic> => {
  const response = await httpClient.put({
    url: `${apiLinks.statistics.getAdminProfitMonthlyIncome}/${year}`,
    token: token,
  });
  return response.data;
};

const statistics = {
  getOverviewStatistics,
  getAdminRevenueMonthlyIncome,
  getAdminProfitMonthlyIncome,
};

export default statistics;
