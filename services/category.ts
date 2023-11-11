import { ParamGet } from "@models/base";
import { Category, CategoryCreate, CategoryDetail } from "@models/category";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getCategoryTree = async (
  token: string,
  paramGet?: ParamGet
): Promise<Category[]> => {
  const response = await httpClient.get({
    url: apiLinks.category.getTree,
    token: token,
    params: paramGet,
  });
  return response.data;
};
const updateCategory = async (
  token: string,
  data: CategoryCreate
): Promise<Category> => {
  const response = await httpClient.put({
    url: apiLinks.category.update,
    token: token,
    data: data,
  });
  return response.data;
};
const createCategory = async (
  token: string,
  data: CategoryCreate
): Promise<Category> => {
  const response = await httpClient.post({
    url: apiLinks.category.create,
    token: token,
    data: data,
  });
  return response.data;
};
const deleteCategory = async (token: string, id: string): Promise<Category> => {
  const response = await httpClient.delete({
    url: apiLinks.category.delete + `/${id}`,
    token: token,
  });
  return response.data;
};

const getCategoryDetail = async (
  token: string,
  id: string
): Promise<CategoryDetail> => {
  const response = await httpClient.get({
    url: apiLinks.category.getDetail + `/${id}`,
    token: token,
  });
  return response.data;
};

const categoryService = {
  getCategoryTree,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryDetail,
};

export default categoryService;
