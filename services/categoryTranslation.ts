import { Category } from "@models/category";
import {
  CategoryTranslationCreate,
  CategoryTranslationData,
  ParamGetCateTrans,
} from "@models/categoryTranslation";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const updateCateTrans = async (
  token: string,
  data: CategoryTranslationCreate
): Promise<any> => {
  const response = await httpClient.put({
    url: apiLinks.categoryTranslation.update,
    token: token,
    data: data,
  });
  return response.data;
};
const createCateTrans = async (
  token: string,
  data: CategoryTranslationCreate
): Promise<any> => {
  const response = await httpClient.post({
    url: apiLinks.categoryTranslation.create,
    token: token,
    data: data,
  });
  return response.data;
};
const deleteCateTrans = async (
  token: string,
  id: string
): Promise<Category> => {
  const response = await httpClient.delete({
    url: apiLinks.categoryTranslation.delete + `/${id}`,
    token: token,
  });
  return response.data;
};

const getCateTransByCategoryId = async (
  token: string,
  params: ParamGetCateTrans
): Promise<CategoryTranslationData> => {
  const response = await httpClient.get({
    url: apiLinks.categoryTranslation.getByCategoryId,
    token: token,
    params: params,
  });
  return response.data;
};

const categoryTranslationService = {
  createCateTrans,
  updateCateTrans,
  deleteCateTrans,
  getCateTransByCategoryId,
};

export default categoryTranslationService;
