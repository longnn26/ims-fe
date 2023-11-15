import { ParamGet } from "@models/base";
import {
  SHCCreateModel,
  SHCUpdateModel,
  ServerHardwareConfigData,
} from "@models/serverHardwareConfig";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getServerHardwareConfigData = async (
  token: string,
  params: ParamGet
): Promise<ServerHardwareConfigData> => {
  const response = await httpClient.get({
    token: token,
    url: apiLinks.serverHardwareConfig.get,
    params: params,
  });
  return response.data;
};

const createServerHardwareConfig = async (
  token: string,
  data: SHCCreateModel
): Promise<any> => {
  const response = await httpClient.post({
    token: token,
    url: apiLinks.serverHardwareConfig.create,
    data: data,
  });
  return response.data;
};

const updateServerHardwareConfig = async (
  token: string,
  data: SHCUpdateModel
): Promise<any> => {
  const response = await httpClient.put({
    token: token,
    url: apiLinks.serverHardwareConfig.create,
    data: data,
  });
  return response.data;
};

const deleteServerHardwareConfig = async (
  token: string,
  id: string
): Promise<any> => {
  const response = await httpClient.delete({
    url: apiLinks.serverHardwareConfig.delete + `/${id}`,
    token: token,
  });
  return response.data;
};

const serverHardwareConfig = {
  getServerHardwareConfigData,
  createServerHardwareConfig,
  updateServerHardwareConfig,
  deleteServerHardwareConfig,
};

export default serverHardwareConfig;
