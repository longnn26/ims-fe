import { ParamGet } from "@models/base";
import { IpAddressData } from "@models/ipAddress";
import {
  RUIpAdressParamGet,
  RequestHost,
  RequestHostCompleteModel,
  RequestHostCreateModel,
  RequestHostData,
  RequestHostRejectModel,
  RequestHostUpdateModel,
} from "@models/requestHost";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getData = async (
  token: string,
  params: ParamGet
): Promise<RequestHostData> => {
  const response = await httpClient.get({
    token: token,
    url: `${apiLinks.requestHost.get}`,
    params: params,
  });
  return response.data;
};

const getDataAll = async (
  token: string,
  params: ParamGet
): Promise<RequestHostData> => {
  const response = await httpClient.get({
    token: token,
    url: apiLinks.requestHost.getAll,
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

const createData = async (
  token: string,
  data: RequestHostCreateModel
): Promise<any> => {
  const response = await httpClient.post({
    token: token,
    url: apiLinks.requestHost.create,
    data: data,
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

const acceptRequestHost = async (
  token: string,
  id: string,
  saleNote: string
): Promise<any> => {
  const response = await httpClient.put({
    url: apiLinks.requestHost.accept + `/${id}/Accept`,
    token: token,
    data: { saleNote: saleNote },
  });
  return response.data;
};

const completeRequestHost = async (
  token: string,
  id: number,
  data: RequestHostCompleteModel
): Promise<any> => {
  const response = await httpClient.put({
    url: apiLinks.requestHost.complete + `/${id}/Complete`,
    token: token,
    data: data,
  });
  return response.data;
};

const rejectRequestHost = async (
  token: string,
  id: number,
  data: RequestHostRejectModel
): Promise<any> => {
  const response = await httpClient.put({
    url: apiLinks.requestHost.reject + `/${id}/Reject`,
    token: token,
    data: data,
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

const saveProvideIps = async (
  token: string,
  id: number,
  ipAddressIds: number[]
): Promise<any> => {
  const response = await httpClient.put({
    token: token,
    url: apiLinks.requestHost.update + `/${id}/IpAddress`,
    data: { ipAddressIds: ipAddressIds },
  });
  return response.data;
};

const uploadDocument = async (
  token: string,
  id: string,
  data: FormData
): Promise<any> => {
  const response = await httpClient.post({
    contentType: "multipart/form-data",
    url: apiLinks.requestHost.upload + `/${id}/Document`,
    token: token,
    data: data,
  });
  return response.data;
};

const confirmDocument = async (token: string, id: string): Promise<any> => {
  const response = await httpClient.put({
    url:
      apiLinks.requestHost.confirmDocument + `/${id}/DocumentConfirmation/True`,
    token: token,
  });
  return response.data;
};

const requestHost = {
  getData,
  getDetail,
  createData,
  denyRequestHost,
  acceptRequestHost,
  completeRequestHost,
  rejectRequestHost,
  updateData,
  saveProvideIps,
  uploadDocument,
  confirmDocument,
  getDataAll,
};

export default requestHost;
