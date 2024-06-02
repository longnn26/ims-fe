import { ParamGet, ParamGetWithId } from "@models/base";
import { SupportType, SupportPause, SupportListData } from "@models/support";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const createSupport = async (
  token: string,
  model: SupportType
): Promise<any> => {
  const response = await httpClient.post({
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
): Promise<SupportListData> => {
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
): Promise<SupportType> => {
  const response = await httpClient.put({
    url: `${apiLinks.support.changeToInProcess}/${id}`,
    token: token,
  });
  return response.data;
};

const changeToSolvedStatus = async (
  token: string,
  id?: string
): Promise<SupportType> => {
  const response = await httpClient.put({
    url: `${apiLinks.support.changeToSolved}/${id}`,
    token: token,
  });
  return response.data;
};

const changeToPauseStatus = async (
  token: string,
  model: SupportPause
): Promise<SupportType> => {
  const response = await httpClient.put({
    url: `${apiLinks.support.changeToPause}`,
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
  changeToPauseStatus,
};

export default support;
