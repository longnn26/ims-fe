import {
  ProductAttributeCreate,
  ProductAttributeInfo,
  ProductAttributePaging,
  ProductAttributeUpdate,
} from "@models/productAttribute";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getProductAttributes = async (
  token?: string,
  pageIndex?: number,
  pageSize?: number
): Promise<ProductAttributePaging> => {
  const response = await httpClient.get({
    token: token,
    url: apiLinks.productAttribute.get,
    params: { pageIndex, pageSize },
  });
  return response.data;
};

const getProductAttributeInfo = async (
  token?: string,
  id?: string
): Promise<ProductAttributeInfo> => {
  const response = await httpClient.get({
    token: token,
    url: `${apiLinks.productAttribute.getInfo}/${id}`,
  });
  return response.data;
};

const updateProductAttribute = async (
  token?: string,
  data?: ProductAttributeUpdate
): Promise<any> => {
  const response = await httpClient.put({
    token: token,
    url: `${apiLinks.productAttribute.update}`,
    data: data,
  });
  return response.data;
};

const createProductAttribute = async (
  token?: string,
  data?: ProductAttributeCreate
): Promise<any> => {
  const response = await httpClient.post({
    token: token,
    url: `${apiLinks.productAttribute.create}`,
    data: data,
  });
  return response.data;
};

const deleteProductAttribute = async (
  token?: string,
  id?: string
): Promise<any> => {
  const response = await httpClient.delete({
    token: token,
    url: `${apiLinks.productAttribute.delete}/${id}`,
  });
  return response.data;
};

const productAttribute = {
  getProductAttributes,
  updateProductAttribute,
  createProductAttribute,
  deleteProductAttribute,
  getProductAttributeInfo
};

export default productAttribute;
