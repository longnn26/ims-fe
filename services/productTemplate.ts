import { ProductProduct, ProductProductPaging } from "@models/productProduct";
import {
  ProductTemplatePaging,
  ProductTemplateInfo,
  ProductTemplateCreate,
  ProductTemplateUpdate,
  ProductTemplate,
  ProductVariantCreate,
  SuggestProductVariant,
} from "@models/productTemplate";
import { StockQuantPaging } from "@models/stockQuant";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getProductTemplates = async (
  token?: string,
  pageIndex?: number,
  pageSize?: number,
  searchText?: string
): Promise<ProductTemplatePaging> => {
  const response = await httpClient.get({
    token: token,
    url: apiLinks.productTemplate.get,
    params: {
      pageIndex,
      pageSize,
      SortKey: "Name",
      SortOrder: "ASC",
      SearchText: searchText,
    },
  });
  return response.data;
};

const getProductTemplateInfo = async (
  token?: string,
  id?: string
): Promise<ProductTemplateInfo> => {
  const response = await httpClient.get({
    token: token,
    url: `${apiLinks.productTemplate.getInfo}/${id}`,
  });
  return response.data;
};

const updateProductTemplate = async (
  token?: string,
  data?: ProductTemplateUpdate
): Promise<any> => {
  const response = await httpClient.put({
    token: token,
    url: `${apiLinks.productTemplate.update}`,
    data: data,
  });
  return response.data;
};

const createProductTemplate = async (
  token?: string,
  data?: ProductTemplateCreate
): Promise<ProductTemplate> => {
  const response = await httpClient.post({
    token: token,
    url: `${apiLinks.productTemplate.create}`,
    data: data,
  });
  return response.data;
};

const deleteProductTemplate = async (
  token?: string,
  id?: string
): Promise<any> => {
  const response = await httpClient.delete({
    token: token,
    url: `${apiLinks.productTemplate.delete}/${id}`,
  });
  return response.data;
};

const getProductVariants = async (
  token?: string,
  productTmplId?: string,
  pageIndex?: number,
  pageSize?: number
): Promise<ProductProductPaging> => {
  const response = await httpClient.get({
    token: token,
    url: `${apiLinks.productTemplate.getProductVariant}/${productTmplId}`,
    params: { pageIndex, pageSize, SortKey: "CreateDate", SortOrder: "ASC" },
  });
  return response.data;
};

const suggestProductVariants = async (
  token?: string,
  productTmplId?: string
): Promise<SuggestProductVariant[][]> => {
  const response = await httpClient.get({
    token: token,
    url: `${apiLinks.productTemplate.suggestProductVariant}/${productTmplId}`,
  });
  return response.data;
};

const getStockQuants = async (
  token?: string,
  productTmplId?: string,
  pageIndex?: number,
  pageSize?: number
): Promise<StockQuantPaging> => {
  const response = await httpClient.get({
    token: token,
    url: `${apiLinks.productTemplate.getStockQuant}/${productTmplId}`,
    params: { pageIndex, pageSize, SortKey: "CreateDate", SortOrder: "ASC" },
  });
  return response.data;
};

const createProductVariant = async (
  token?: string,
  data?: ProductVariantCreate
): Promise<any> => {
  const response = await httpClient.post({
    token: token,
    url: `${apiLinks.productTemplate.createProductVariant}`,
    data: data,
  });
  return response.data;
};

const getProductVariantForSelect = async (
  token?: string,
  productTmplId?: string
): Promise<ProductProduct[]> => {
  const response = await httpClient.get({
    token: token,
    url: `${apiLinks.productTemplate.getForSelect}/${productTmplId}`,
  });
  return response.data;
};

const updateImage = async (
  token: string,
  id: string,
  data: FormData
): Promise<any> => {
  const response = await httpClient.put({
    contentType: "multipart/form-data",
    url: `${apiLinks.productTemplate.updateImage}/${id}`,
    token: token,
    data: data,
  });
  return response.data;
};

const productTemplate = {
  getProductTemplates,
  getProductTemplateInfo,
  updateProductTemplate,
  createProductTemplate,
  deleteProductTemplate,
  getProductVariants,
  suggestProductVariants,
  createProductVariant,
  getStockQuants,
  getProductVariantForSelect,
  updateImage
};

export default productTemplate;
