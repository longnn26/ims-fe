import {
  StockLocation,
  StockLocationPaging,
  StockLocationInfo,
} from "@models/stockLocation";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getStockLocations = async (
  token?: string,
  pageIndex?: number,
  pageSize?: number
): Promise<StockLocationPaging> => {
  const response = await httpClient.get({
    token: token,
    url: apiLinks.stockLocation.get,
    params: { pageIndex, pageSize, SortKey: "CompleteName", SortOrder: "ASC" },
  });
  return response.data;
};

const getStockLocationInfo = async (
  token?: string,
  id?: string
): Promise<StockLocationInfo> => {
  const response = await httpClient.get({
    token: token,
    url: `${apiLinks.stockLocation.getInfo}/${id}`,
  });
  return response.data;
};

const stockLocation = {
  getStockLocations,
  getStockLocationInfo
};

export default stockLocation;
