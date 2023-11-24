import { AppointmentData } from "@models/appointment";
import { ParamGet } from "@models/base";
import {
  RequestUpgradeCreateModel,
  RequestUpgradeUpdateModel,
  RequestUpgradeData,
  RequestUpgrade,
  RUAppointmentParamGet,
} from "@models/requestUpgrade";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getData = async (
  token: string,
  params: ParamGet
): Promise<RequestUpgradeData> => {
  const response = await httpClient.get({
    token: token,
    url: apiLinks.requestUpgrade.get,
    params: params,
  });
  return response.data;
};

const getDetail = async (
  token: string,
  id: string
): Promise<RequestUpgrade> => {
  const response = await httpClient.get({
    url: apiLinks.requestUpgrade.getById + `/${id}`,
    token: token,
  });
  return response.data;
};

const getAppointmentsById = async (
  token: string,
  params: RUAppointmentParamGet
): Promise<AppointmentData> => {
  const response = await httpClient.get({
    url:
      apiLinks.requestUpgrade.getAppointmentsById + `/${params.Id}/Appointment`,
    token: token,
  });
  return response.data;
};

const createData = async (
  token: string,
  data: RequestUpgradeCreateModel
): Promise<any> => {
  const response = await httpClient.post({
    token: token,
    url: apiLinks.requestUpgrade.create,
    data: data,
  });
  return response.data;
};

const updateData = async (
  token: string,
  data: RequestUpgradeUpdateModel
): Promise<any> => {
  const response = await httpClient.put({
    token: token,
    url: apiLinks.requestUpgrade.create,
    data: data,
  });
  return response.data;
};

const deleteData = async (token: string, id: string): Promise<any> => {
  const response = await httpClient.delete({
    url: apiLinks.requestUpgrade.delete + `/${id}`,
    token: token,
  });
  return response.data;
};

const acceptRequestUpgrade = async (
  token: string,
  id: string
): Promise<any> => {
  const response = await httpClient.put({
    url: apiLinks.requestUpgrade.accept + `/${id}/Accept`,
    token: token,
  });
  return response.data;
};

const denyRequestUpgrade = async (token: string, id: string): Promise<any> => {
  const response = await httpClient.put({
    url: apiLinks.requestUpgrade.accept + `/${id}/Deny`,
    token: token,
  });
  return response.data;
};

const requestUpgrade = {
  getData,
  getAppointmentsById,
  createData,
  updateData,
  deleteData,
  getDetail,
  acceptRequestUpgrade,
  denyRequestUpgrade,
};

export default requestUpgrade;
