import { ProductProduct } from "@models/productProduct";
import { StockQuantPaging, StockQuantUpdate } from "@models/stockQuant";
import { UomUomInfo } from "@models/uomUom";
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

const getProductVariantForSelect = async (
  token?: string
): Promise<ProductProduct[]> => {
  const response = await httpClient.get({
    token: token,
    url: `${apiLinks.productProduct.getProductVariant}`,
  });
  return response.data;
};

const getUomUomForSelect = async (
  token?: string,
  productId?: string
): Promise<UomUomInfo[]> => {
  const response = await httpClient.get({
    token: token,
    url: `${apiLinks.productProduct.getUomUomForSelect}/${productId}`,
  });
  return response.data;
};

const productProduct = {
  deleteProductProduct,
  getStockQuants,
  getProductVariantForSelect,
  getUomUomForSelect
};

export default productProduct;
