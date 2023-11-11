import {
  BlogTranslation,
  BlogTranslationCreate,
  BlogTranslationUpdate,
} from "@models/blogTranslation";
import { Language } from "@models/language";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const createBlogTranslation = async (
  token: string,
  data: BlogTranslationCreate
): Promise<any> => {
  const response = await httpClient.post({
    url: apiLinks.blogTranslation.create,
    token: token,
    data: data,
  });
  return response.data;
};

const updateBlogTranslation = async (
  token: string,
  data: BlogTranslationUpdate
): Promise<any> => {
  const response = await httpClient.put({
    url: apiLinks.blogTranslation.update,
    token: token,
    data: data,
  });
  return response.data;
};

const deleteBlogTranslation = async (token: string, id: string): Promise<BlogTranslation> => {
  const response = await httpClient.delete({
    url: apiLinks.blogTranslation.delete + `/${id}`,
    token: token,
  });
  return response.data;
};

const blogTranslationService = {
  createBlogTranslation,
  updateBlogTranslation,
  deleteBlogTranslation
};

export default blogTranslationService;
