import {
  ProductCategoryPaging,
  ProductCategoryUpdateInfo,
  ProductCategoryCreate,
  ProductCategoryInfo,
  ProductCategory,
  ProductCategoryUpdateParent,
} from "@models/productCategory";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getProductCategories = async (
  token?: string,
  pageIndex?: number,
  pageSize?: number
): Promise<ProductCategoryPaging> => {
  const response = await httpClient.get({
    token: token,
    url: apiLinks.productCategory.get,
    params: { pageIndex, pageSize, SortKey: "CompleteName", SortOrder: "ASC" },
  });
  return response.data;
};

const getProductCategoryInfo = async (
  token?: string,
  id?: string
): Promise<ProductCategoryInfo> => {
  const response = await httpClient.get({
    token: token,
    url: `${apiLinks.productCategory.getInfo}/${id}`,
  });
  return response.data;
};

const getForSelectParent = async (
  token?: string,
  id?: string
): Promise<ProductCategory[]> => {
  const response = await httpClient.get({
    token: token,
    url: `${apiLinks.productCategory.getSelectParent}/${id}`,
  });
  return response.data;
};

const updateProductCategoryInfo = async (
  token?: string,
  data?: ProductCategoryUpdateInfo
): Promise<any> => {
  const response = await httpClient.put({
    token: token,
    url: `${apiLinks.productCategory.update}`,
    data: data,
  });
  return response.data;
};

const updateProductCategoryParent = async (
  token?: string,
  data?: ProductCategoryUpdateParent
): Promise<any> => {
  const response = await httpClient.put({
    token: token,
    url: `${apiLinks.productCategory.updateParent}`,
    data: data,
  });
  return response.data;
};

const createProductCategory = async (
  token?: string,
  data?: ProductCategoryCreate
): Promise<any> => {
  const response = await httpClient.post({
    token: token,
    url: `${apiLinks.productCategory.create}`,
    data: data,
  });
  return response.data;
};

const deleteProductCategory = async (
  token?: string,
  id?: string
): Promise<any> => {
  const response = await httpClient.delete({
    token: token,
    url: `${apiLinks.productCategory.delete}/${id}`,
  });
  return response.data;
};

const productCategory = {
  getProductCategories,
  getProductCategoryInfo,
  updateProductCategoryInfo,
  createProductCategory,
  deleteProductCategory,
  getForSelectParent,
  updateProductCategoryParent,
};

export default productCategory;
