import { StockPickingCreate, StockPickingPaging } from "@models/stockPicking";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getStockPickingIncomings = async (
  token?: string,
  warehouseId?: string,
  pageIndex?: number,
  pageSize?: number
): Promise<StockPickingPaging> => {
  const response = await httpClient.get({
    token: token,
    url: `${apiLinks.stockPicking.getIncoming}/${warehouseId}`,
    params: { pageIndex, pageSize, SortKey: "CreateDate", SortOrder: "DESC" },
  });
  return response.data;
};

const getStockPickingInternals = async (
  token?: string,
  warehouseId?: string,
  pageIndex?: number,
  pageSize?: number
): Promise<StockPickingPaging> => {
  const response = await httpClient.get({
    token: token,
    url: `${apiLinks.stockPicking.getInternal}/${warehouseId}`,
    params: { pageIndex, pageSize, SortKey: "CreateDate", SortOrder: "DESC" },
  });
  return response.data;
};

const getStockPickingOutgoings = async (
  token?: string,
  warehouseId?: string,
  pageIndex?: number,
  pageSize?: number
): Promise<StockPickingPaging> => {
  const response = await httpClient.get({
    token: token,
    url: `${apiLinks.stockPicking.getOutgoing}/${warehouseId}`,
    params: { pageIndex, pageSize, SortKey: "CreateDate", SortOrder: "DESC" },
  });
  return response.data;
};

const createStockPicking = async (
  token?: string,
  data?: StockPickingCreate
): Promise<any> => {
  const response = await httpClient.post({
    token: token,
    url: `${apiLinks.stockPicking.create}`,
    data: data,
  });
  return response.data;
};

const stockPicking = {
  getStockPickingIncomings,
  getStockPickingInternals,
  getStockPickingOutgoings,
  createStockPicking
};

export default stockPicking;
