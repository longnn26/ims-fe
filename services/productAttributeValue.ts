import {
  ProductAttributeValueCreate,
  ProductAttributeValuePaging,
  ProductAttributeValueUpdate,
} from "@models/productAttributeValue";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getProductAttributeValues = async (
  token?: string,
  productAttributeId?: string,
  pageIndex?: number,
  pageSize?: number
): Promise<ProductAttributeValuePaging> => {
  const response = await httpClient.get({
    token: token,
    url: `${apiLinks.productAttribute.getValues}/${productAttributeId}`,
    params: { pageIndex, pageSize },
  });
  return response.data;
};

const updateProductAttributeValue = async (
  token?: string,
  data?: ProductAttributeValueUpdate
): Promise<any> => {
  const response = await httpClient.put({
    token: token,
    url: apiLinks.productAttributeValue.update,
    data: data,
  });
  return response.data;
};

const createProductAttributeValue = async (
  token?: string,
  data?: ProductAttributeValueCreate
): Promise<any> => {
  data!.name = "New";
  const response = await httpClient.post({
    token: token,
    url: apiLinks.productAttributeValue.create,
    data: data,
  });
  return response.data;
};

const deleteProductAttributeValue = async (
  token?: string,
  id?: string
): Promise<any> => {
  const response = await httpClient.delete({
    token: token,
    url: `${apiLinks.productAttributeValue.delete}/${id}`,
  });
  return response.data;
};

const productAttributeValue = {
  getProductAttributeValues,
  updateProductAttributeValue,
  createProductAttributeValue,
  deleteProductAttributeValue,
};

export default productAttributeValue;
