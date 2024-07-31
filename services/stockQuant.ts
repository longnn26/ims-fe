import { StockQuantCreate, StockQuantUpdate } from "@models/stockQuant";
import { StockMoveLinePaging } from "@models/stockMoveLine";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const createStockQuant = async (
  token?: string,
  data?: StockQuantCreate
): Promise<any> => {
  const response = await httpClient.post({
    token: token,
    url: `${apiLinks.stockQuant.create}`,
    data: data,
  });
  return response.data;
};

const getMoveLines = async (
  token?: string,
  quantId?: string,
  pageIndex?: number,
  pageSize?: number
): Promise<StockMoveLinePaging> => {
  const response = await httpClient.get({
    token: token,
    url: `${apiLinks.stockQuant.getMoveLines}/${quantId}`,
    params: { pageIndex, pageSize, SortKey: "CreateDate", SortOrder: "DESC" },
  });
  return response.data;
};

const updateStockQuant = async (
  token?: string,
  data?: StockQuantUpdate
): Promise<any> => {
  const response = await httpClient.put({
    token: token,
    url: `${apiLinks.stockQuant.update}`,
    data: data,
  });
  return response.data;
};

const setStockQuant = async (token?: string, id?: string): Promise<any> => {
  const response = await httpClient.put({
    token: token,
    url: `${apiLinks.stockQuant.setStockQuant}/${id}`,
  });
  return response.data;
};

const clearStockQuant = async (token?: string, id?: string): Promise<any> => {
  const response = await httpClient.put({
    token: token,
    url: `${apiLinks.stockQuant.clearStockQuant}/${id}`,
  });
  return response.data;
};

const applyStockQuant = async (token?: string, id?: string): Promise<any> => {
  const response = await httpClient.put({
    token: token,
    url: `${apiLinks.stockQuant.applyStockQuant}/${id}`,
  });
  return response.data;
};

const stockQuant = {
  createStockQuant,
  getMoveLines,
  updateStockQuant,
  setStockQuant,
  clearStockQuant,
  applyStockQuant
};

export default stockQuant;
