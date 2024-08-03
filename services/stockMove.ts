import { StockMoveCreate, StockMoveQuantityUpdate } from "@models/stockMove";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const createStockMove = async (
  token?: string,
  data?: StockMoveCreate
): Promise<any> => {
  const response = await httpClient.post({
    token: token,
    url: `${apiLinks.stockMove.create}`,
    data: data,
  });
  return response.data;
};

const deleteStockMove = async (token?: string, id?: string): Promise<any> => {
  const response = await httpClient.delete({
    token: token,
    url: `${apiLinks.stockMove.delete}/${id}`,
  });
  return response.data;
};

const updateQuantity = async (
  token?: string,
  data?: StockMoveQuantityUpdate
): Promise<any> => {
  const response = await httpClient.put({
    token: token,
    url: `${apiLinks.stockMove.updateQuantity}`,
    data: data,
  });
  return response.data;
};

const stockQuant = {
  createStockMove,
  deleteStockMove,
  updateQuantity,
};

export default stockQuant;
