import { StockQuantCreate } from "@models/stockQuant";
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

const stockQuant = {
  createStockQuant,
};

export default stockQuant;
