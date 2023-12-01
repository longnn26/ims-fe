import { IpAddress } from "@models/ipAddress";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getSuggestMaster = async (token: string): Promise<IpAddress> => {
  const response = await httpClient.get({
    token: token,
    url: apiLinks.ipAddress.getSuggestMaster,
  });
  return response.data;
};

const ipAddress = {
  getSuggestMaster,
};

export default ipAddress;
