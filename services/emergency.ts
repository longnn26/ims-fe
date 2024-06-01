import { ParamGet } from "@models/base";
import {
  EmergencyType,
  EmergencySolved,
  EmergencyListData,
} from "@models/emergency";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getEmergencyById = async (token: string, id?: string): Promise<any> => {
  const response = await httpClient.get({
    url: `${apiLinks.emergency.getById}/${id}`,
    token: token,
  });
  return response.data;
};

const getAllEmergency = async (
  token: string,
  params?: ParamGet
): Promise<EmergencyListData> => {
  const response = await httpClient.get({
    url: `${apiLinks.emergency.getAll}`,
    token: token,
    params: params,
  });
  return response.data;
};

const changeToProcessingStatus = async (
  token: string,
  id?: string
): Promise<EmergencyType> => {
  const response = await httpClient.put({
    url: `${apiLinks.emergency.changeToProcessing}/${id}`,
    token: token,
  });
  return response.data;
};

const changeToSolvedStatus = async (
  token: string,
  model: EmergencySolved
): Promise<EmergencyType> => {
  const response = await httpClient.put({
    url: `${apiLinks.emergency.changeToSolved}`,
    token: token,
    data: model,
  });
  return response.data;
};

const emergency = {
  getEmergencyById,
  getAllEmergency,
  changeToProcessingStatus,
  changeToSolvedStatus,
};

export default emergency;
