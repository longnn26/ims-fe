import { ParamGet } from "@models/base";
import { RequestExpand, RequestExpandData } from "@models/requestExpand";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getData = async (
  token: string,
  params: ParamGet,
  id: number
): Promise<RequestExpandData> => {
  const response = await httpClient.get({
    token: token,
    url: `${apiLinks.requestExpand.get}/${id}/RequestExpand`,
    params: params,
  });
  return response.data;
};

const getDetail = async (
  token: string,
  id: string
): Promise<RequestExpand> => {
  const response = await httpClient.get({
    url: apiLinks.requestExpand.getById + `/${id}`,
    token: token,
  });
  return response.data;
};

const acceptRequestExpand = async (token: string, id: string): Promise<any> => {
  const response = await httpClient.put({
    url: apiLinks.requestExpand.accept + `/${id}/Accept`,
    token: token,
  });
  return response.data;
};

const denyRequestExpand = async (token: string, id: string): Promise<any> => {
  const response = await httpClient.put({
    url: apiLinks.requestExpand.accept + `/${id}/Deny`,
    token: token,
  });
  return response.data;
};

const completeRequestExpand = async (
  token: string,
  id: string
): Promise<any> => {
  const response = await httpClient.put({
    url: apiLinks.requestExpand.complete + `/${id}/Complete`,
    token: token,
  });
  return response.data;
};

const rejectRequestExpand = async (token: string, id: string): Promise<any> => {
  const response = await httpClient.put({
    url: apiLinks.requestExpand.reject + `/${id}/Reject`,
    token: token,
  });
  return response.data;
};

const requestExpand = {
  getData,
  getDetail,
  acceptRequestExpand,
  completeRequestExpand,
  rejectRequestExpand,
  denyRequestExpand,
};

export default requestExpand;
