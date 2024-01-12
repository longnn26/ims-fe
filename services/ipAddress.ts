import {
  IpAddress,
  IpAddressData,
  IpAddressHistory,
  IpAddressHistoryData,
  IpAddressParamGet,
} from "@models/ipAddress";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getSuggestMaster = async (token: string): Promise<IpAddress> => {
  const response = await httpClient.get({
    token: token,
    url: apiLinks.ipAddress.getSuggestMaster,
  });
  return response.data;
};

const getData = async (
  token: string,
  ipAddressParamGet: IpAddressParamGet
): Promise<IpAddressData> => {
  const response = await httpClient.get({
    token: token,
    url: apiLinks.ipAddress.get,
    params: ipAddressParamGet,
  });
  return response.data;
};

const blockIp = async (
  token: string,
  reason: string,
  id: number[]
): Promise<IpAddressData> => {
  const response = await httpClient.put({
    token: token,
    url: apiLinks.ipAddress.block,
    data: { reason: reason, ipAddressIds: id },
  });
  return response.data;
};

const unblockIp = async (
  token: string,
  reason: string,
  id: number[]
): Promise<IpAddressData> => {
  const response = await httpClient.put({
    token: token,
    url: apiLinks.ipAddress.unblock,
    data: { reason: reason, ipAddressIds: id },
  });
  return response.data;
};

const getHistory = async (
  token: string,
  params: IpAddressHistory
): Promise<IpAddressHistoryData> => {
  const response = await httpClient.get({
    token: token,
    url: apiLinks.ipAddress.history + `/${params.id}/History`,
  });
  return response.data;
};

const ipAddress = {
  getSuggestMaster,
  getData,
  blockIp,
  unblockIp,
  getHistory,
};

export default ipAddress;
