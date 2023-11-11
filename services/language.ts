import { ParamGet } from "@models/base";
import { Language, LanguageData, LanguageDataPublic } from "@models/language";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const createLanguage = async (
  token: string,
  data: FormData
): Promise<Language> => {
  const response = await httpClient.post({
    contentType: "multipart/form-data",
    url: apiLinks.language.create,
    token: token,
    data: data,
  });
  return response.data;
};

const updateLanguage = async (
  token: string,
  data: FormData
): Promise<Language> => {
  const response = await httpClient.put({
    contentType: "multipart/form-data",
    url: apiLinks.language.update,
    token: token,
    data: data,
  });
  return response.data;
};

const getLanguages = async (token: string): Promise<Language[]> => {
  const response = await httpClient.get({
    url: apiLinks.language.get,
    token: token,
  });
  return response.data;
};
const getLanguageData = async (
  token: string,
  paramGet: ParamGet
): Promise<LanguageData> => {
  const response = await httpClient.get({
    url: apiLinks.language.getData,
    token: token,
    params: paramGet,
  });
  return response.data;
};

const deleteLanguage = async (token: string, id: string): Promise<Language> => {
  const response = await httpClient.delete({
    url: apiLinks.language.delete + `/${id}`,
    token: token,
  });
  return response.data;
};

const getLanguagePublic = async (
  paramGet: ParamGet
): Promise<LanguageDataPublic> => {
  const response = await httpClient.get({
    url: apiLinks.language.getLanguagePublic,
    params: paramGet,
  });
  return response.data;
};

const languageService = {
  getLanguages,
  getLanguageData,
  deleteLanguage,
  createLanguage,
  updateLanguage,
  getLanguagePublic,
};

export default languageService;
