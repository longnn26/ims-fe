import { ParamGet } from "@models/base";
import {
  AssignCategory,
  Blog,
  BlogCategory,
  BlogContentPublic,
  BlogData,
  BlogGetContentRqPublic,
  BlogPublicData,
  ParamGetBlogPublic,
} from "@models/blog";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const createBlog = async (token: string, data: FormData): Promise<Blog> => {
  const response = await httpClient.post({
    contentType: "multipart/form-data",
    url: apiLinks.blog.create,
    token: token,
    data: data,
  });
  return response.data;
};

const updateBlog = async (token: string, data: FormData): Promise<Blog> => {
  const response = await httpClient.put({
    contentType: "multipart/form-data",
    url: apiLinks.blog.update,
    token: token,
    data: data,
  });
  return response.data;
};

const getBlogData = async (
  token: string,
  paramGet: ParamGet
): Promise<BlogData> => {
  const response = await httpClient.get({
    url: apiLinks.blog.get,
    token: token,
    params: paramGet,
  });
  return response.data;
};

const deleteBlog = async (token: string, id: string): Promise<Blog> => {
  const response = await httpClient.delete({
    url: apiLinks.blog.delete + `/${id}`,
    token: token,
  });
  return response.data;
};

const getBlogCategory = async (
  token: string,
  id: string
): Promise<BlogCategory[]> => {
  const response = await httpClient.get({
    url: apiLinks.blog.getBlogCategory + `/${id}`,
    token: token,
  });
  return response.data;
};

const assignCategory = async (
  token: string,
  data: AssignCategory
): Promise<BlogCategory[]> => {
  const response = await httpClient.post({
    url: apiLinks.blog.assignCategory,
    token: token,
    data: data,
  });
  return response.data;
};

const getBlogPublic = async (
  params: ParamGetBlogPublic
): Promise<BlogPublicData> => {
  const response = await httpClient.get({
    // url: apiLinks.blog.getBlogPublic,
    url: apiLinks.blog.getBlogPublic + params?.UrlFilter,
    params: { ...params, UrlFilter: undefined },
  });
  return response.data;
};

const getBlogContentPublic = async (
  params: BlogGetContentRqPublic
): Promise<BlogContentPublic> => {
  const response = await httpClient.get({
    url: apiLinks.blog.getBlogContentPublic,
    params: params,
  });
  return response.data;
};

const blogService = {
  createBlog,
  updateBlog,
  getBlogData,
  deleteBlog,
  getBlogCategory,
  assignCategory,
  getBlogPublic,
  getBlogContentPublic
};

export default blogService;
