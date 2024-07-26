import {
  StockWarehouse,
  StockWarehouseCreate,
  StockWarehouseInfo,
  StockWarehousePaging,
  StockWarehouseUpdate,
} from "@models/stockWarehouse";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getStockWarehouses = async (
  token?: string,
  pageIndex?: number,
  pageSize?: number
): Promise<StockWarehousePaging> => {
  const response = await httpClient.get({
    token: token,
    url: apiLinks.stockWarehouse.get,
    params: { pageIndex, pageSize },
  });
  return response.data;
};

const getStockWarehouseInfo = async (
  token?: string,
  id?: string
): Promise<StockWarehouseInfo> => {
  const response = await httpClient.get({
    token: token,
    url: `${apiLinks.stockWarehouse.getInfo}/${id}`,
  });
  return response.data;
};

const updateStockWarehouse = async (
  token?: string,
  data?: StockWarehouseUpdate
): Promise<any> => {
  const response = await httpClient.put({
    token: token,
    url: `${apiLinks.stockWarehouse.update}`,
    data: data,
  });
  return response.data;
};

const createStockWarehouse = async (
  token?: string,
  data?: StockWarehouseCreate
): Promise<any> => {
  const response = await httpClient.post({
    token: token,
    url: `${apiLinks.stockWarehouse.create}`,
    data: data,
  });
  return response.data;
};

const deleteStockWarehouse = async (
  token?: string,
  id?: string
): Promise<any> => {
  const response = await httpClient.delete({
    token: token,
    url: `${apiLinks.stockWarehouse.delete}/${id}`,
  });
  return response.data;
};

const stockWarehouse = {
  getStockWarehouses,
  getStockWarehouseInfo,
  updateStockWarehouse,
  createStockWarehouse,
  deleteStockWarehouse,
};

export default stockWarehouse;
