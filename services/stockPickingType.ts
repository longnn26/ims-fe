import { StockPickingTypePaging } from "@models/stockPickingType";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getStockPickingTypes = async (
  token?: string,
  pageIndex?: number,
  pageSize?: number
): Promise<StockPickingTypePaging> => {
  const response = await httpClient.get({
    token: token,
    url: apiLinks.stockPickingType.get,
    params: { pageIndex, pageSize, SortKey: "Barcode", SortOrder: "DESC" },
  });
  return response.data;
};

const stockPickingType = {
  getStockPickingTypes,
};

export default stockPickingType;
