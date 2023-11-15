import { ParamGet } from "@models/base";
import {
  SACreateModel,
  SAUpdateModel,
  ServerAllocation,
  ServerAllocationData,
} from "@models/serverAllocation";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getServerAllocationData = async (
  token: string,
  params: ParamGet
): Promise<ServerAllocationData> => {
  const response = await httpClient.get({
    token: token,
    url: apiLinks.serverAllocation.get,
    params: params,
  });
  return response.data;
};

const getServerAllocationById = async (
  token: string,
  id: string,
): Promise<ServerAllocation> => {
  const response = await httpClient.get({
    url: apiLinks.serverAllocation.get + `/${id}`,
    token: token,
  });
  return response.data;
};

const createServerAllocation = async (
  token: string,
  data: SACreateModel
): Promise<any> => {
  const response = await httpClient.post({
    token: token,
    url: apiLinks.serverAllocation.create,
    data: data,
  });
  return response.data;
};

const updateServerAllocation = async (
  token: string,
  data: SAUpdateModel
): Promise<any> => {
  const response = await httpClient.put({
    token: token,
    url: apiLinks.serverAllocation.create,
    data: data,
  });
  return response.data;
};

const deleteServerAllocation = async (
  token: string,
  id: number
): Promise<any> => {
  const response = await httpClient.delete({
    url: apiLinks.serverAllocation.delete + `/${id}`,
    token: token,
  });
  return response.data;
};

const serverAllocation = {
  getServerAllocationData,
  createServerAllocation,
  deleteServerAllocation,
  updateServerAllocation,
  getServerAllocationById,
};

export default serverAllocation;
