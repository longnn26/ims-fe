import { LocationData, LocationParamGet } from "@models/location";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getData = async (
  token: string,
  params: LocationParamGet
): Promise<LocationData> => {
  const response = await httpClient.get({
    token: token,
    url: apiLinks.location.get,
    params: params,
  });
  return response.data;
};

const getAll = async (
  token: string,
  params: LocationParamGet
): Promise<LocationData> => {
  const response = await httpClient.get({
    token: token,
    url: apiLinks.location.getAll,
    params: params,
  });
  return response.data;
};

const reserve = async (token: string, id: number[]): Promise<LocationData> => {
  const response = await httpClient.put({
    token: token,
    url: apiLinks.location.reserve,
    data: { locationIds: id },
  });
  return response.data;
};

const unReserve = async (
  token: string,
  id: number[]
): Promise<LocationData> => {
  const response = await httpClient.put({
    token: token,
    url: apiLinks.location.unReserve,
    data: { locationIds: id },
  });
  return response.data;
};

const location = {
  getData,
  getAll,
  reserve,
  unReserve,
};

export default location;
