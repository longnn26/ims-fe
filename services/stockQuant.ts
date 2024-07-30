import { StockQuantCreate } from "@models/stockQuant";
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
    params: { pageIndex, pageSize, SortKey: "CreateDate", SortOrder: "ASC" },
  });
  return response.data;
};

const stockQuant = {
  createStockQuant,
  getMoveLines,
};

export default stockQuant;
