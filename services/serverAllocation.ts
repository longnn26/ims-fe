import { ParamGet } from "@models/base";
import { SACreateModel, ServerAllocationData } from "@models/serverAllocation";
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

const serverAllocation = {
  getServerAllocationData,
  createServerAllocation,
};

export default serverAllocation;
