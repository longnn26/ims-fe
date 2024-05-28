import { ParamGet, ParamGetWithId } from "@models/base";
import { Support, SupportCantSolved } from "@models/support";
import { LoginResponse } from "@models/user";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const createSupport = async (token: string, model: Support): Promise<any> => {
  const response = await httpClient.put({
    url: apiLinks.support.createSupport,
    token: token,
    data: model,
  });
  return response.data;
};

const getSupportById = async (token: string, id?: string): Promise<any> => {
  const response = await httpClient.get({
    url: `${apiLinks.support.getById}/${id}`,
    token: token,
  });
  return response.data;
};

const getAllSupportByAdmin = async (
  token: string,
  params?: ParamGet
): Promise<Support[]> => {
  const response = await httpClient.get({
    url: `${apiLinks.support.getAll}`,
    token: token,
    params: params,
  });
  return response.data;
};

const changeToInProcessStatus = async (
  token: string,
  id?: string
): Promise<Support[]> => {
  const response = await httpClient.put({
    url: `${apiLinks.support.changeToInProcess}/${id}`,
    token: token,
  });
  return response.data;
};

const changeToSolvedStatus = async (
  token: string,
  id?: string
): Promise<Support[]> => {
  const response = await httpClient.put({
    url: `${apiLinks.support.changeToSolved}/${id}`,
    token: token,
  });
  return response.data;
};

const changeToCantSolvedStatus = async (
  token: string,
  model: SupportCantSolved
): Promise<Support[]> => {
  const response = await httpClient.put({
    url: `${apiLinks.support.changeToCantSolved}`,
    token: token,
    data: model,
  });
  return response.data;
};

const support = {
  createSupport,
  getSupportById,
  getAllSupportByAdmin,
  changeToInProcessStatus,
  changeToSolvedStatus,
  changeToCantSolvedStatus,
};

export default support;
