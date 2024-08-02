import {
  StockPickingCreate,
  StockPickingInfo,
  StockPickingPaging,
  StockPickingReceipt,
  StockPickingReceiptUpdate,
} from "@models/stockPicking";
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

const createStockPickingReceipt = async (
  token?: string,
  data?: StockPickingReceipt
): Promise<any> => {
  const response = await httpClient.post({
    token: token,
    url: `${apiLinks.stockPicking.createReceipt}`,
    data: data,
  });
  return response.data;
};

const deletetockPicking = async (token?: string, id?: string): Promise<any> => {
  const response = await httpClient.delete({
    token: token,
    url: `${apiLinks.stockPicking.delete}/${id}`,
  });
  return response.data;
};

const getStockPickingInfo = async (
  token?: string,
  id?: string
): Promise<StockPickingInfo> => {
  const response = await httpClient.get({
    token: token,
    url: `${apiLinks.stockPicking.getInfo}/${id}`,
  });
  return response.data;
};

const updateStockPickingReceipt = async (
  token?: string,
  data?: StockPickingReceiptUpdate
): Promise<any> => {
  const response = await httpClient.put({
    token: token,
    url: `${apiLinks.stockPicking.updateReceipt}`,
    data: data,
  });
  return response.data;
};

const stockPicking = {
  getStockPickingIncomings,
  getStockPickingInternals,
  getStockPickingOutgoings,
  createStockPicking,
  createStockPickingReceipt,
  deletetockPicking,
  getStockPickingInfo,
  updateStockPickingReceipt
};

export default stockPicking;
