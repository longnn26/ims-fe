import {
  ProductTemplatePaging,
  ProductTemplateInfo,
  ProductTemplateCreate,
  ProductTemplateUpdate,
  ProductTemplate,
} from "@models/productTemplate";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getProductTemplates = async (
  token?: string,
  pageIndex?: number,
  pageSize?: number
): Promise<ProductTemplatePaging> => {
  const response = await httpClient.get({
    token: token,
    url: apiLinks.productTemplate.get,
    params: { pageIndex, pageSize, SortKey: "Name", SortOrder: "ASC" },
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

const productTemplate = {
  getProductTemplates,
  getProductTemplateInfo,
  updateProductTemplate,
  createProductTemplate,
  deleteProductTemplate,
};

export default productTemplate;
