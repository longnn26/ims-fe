import { StockQuantPaging, StockQuantUpdate } from "@models/stockQuant";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const deleteProductProduct = async (
  token?: string,
  id?: string
): Promise<any> => {
  const response = await httpClient.delete({
    token: token,
    url: `${apiLinks.productProduct.delete}/${id}`,
  });
  return response.data;
};

const getStockQuants = async (
  token?: string,
  productId?: string,
  pageIndex?: number,
  pageSize?: number
): Promise<StockQuantPaging> => {
  const response = await httpClient.get({
    token: token,
    url: `${apiLinks.productProduct.getStockQuant}/${productId}`,
    params: { pageIndex, pageSize, SortKey: "CreateDate", SortOrder: "ASC" },
  });
  return response.data;
};

const productProduct = {
  deleteProductProduct,
  getStockQuants,
};

export default productProduct;
