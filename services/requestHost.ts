import { ParamGet } from "@models/base";
import {
  RequestHost,
  RequestHostData,
  RequestHostUpdateModel,
} from "@models/requestHost";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getData = async (
  token: string,
  params: ParamGet,
  id: number
): Promise<RequestHostData> => {
  const response = await httpClient.get({
    token: token,
    url: `${apiLinks.requestHost.get}/${id}/RequestHost`,
    params: params,
  });
  return response.data;
};

const getDetail = async (token: string, id: string): Promise<RequestHost> => {
  const response = await httpClient.get({
    url: apiLinks.requestHost.getById + `/${id}`,
    token: token,
  });
  return response.data;
};

const denyRequestHost = async (
  token: string,
  id: string,
  saleNote: string
): Promise<any> => {
  const response = await httpClient.put({
    url: apiLinks.requestHost.deny + `/${id}/Deny`,
    token: token,
    data: { saleNote: saleNote },
  });
  return response.data;
};

const acceptRequestHost = async (token: string, id: string): Promise<any> => {
  const response = await httpClient.put({
    url: apiLinks.requestHost.accept + `/${id}/Accept`,
    token: token,
    data: { saleNote: "accept" },
  });
  return response.data;
};

const completeRequestHost = async (token: string, id: string): Promise<any> => {
  const response = await httpClient.put({
    url: apiLinks.requestHost.complete + `/${id}/Complete`,
    token: token,
  });
  return response.data;
};

const rejectRequestHost = async (token: string, id: string): Promise<any> => {
  const response = await httpClient.put({
    url: apiLinks.requestHost.reject + `/${id}/Reject`,
    token: token,
  });
  return response.data;
};

const updateData = async (
  token: string,
  data: RequestHostUpdateModel
): Promise<any> => {
  const response = await httpClient.put({
    token: token,
    url: apiLinks.requestHost.update,
    data: data,
  });
  return response.data;
};

const requestHost = {
  getData,
  getDetail,
  denyRequestHost,
  acceptRequestHost,
  completeRequestHost,
  rejectRequestHost,
  updateData,
};

export default requestHost;
