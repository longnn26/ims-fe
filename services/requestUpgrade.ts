import { AppointmentComplete, AppointmentData } from "@models/appointment";
import { ParamGet } from "@models/base";
import {
  RequestUpgradeCreateModel,
  RequestUpgradeUpdateModel,
  RequestUpgradeData,
  RequestUpgrade,
  RUAppointmentParamGet,
  RequestUpgradeRemoveModel,
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

const removeData = async (
  token: string,
  data: RequestUpgradeRemoveModel
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

const completeRequestUpgrade = async (
  token: string,
  id: string
): Promise<any> => {
  const response = await httpClient.put({
    url: apiLinks.requestUpgrade.complete + `/${id}/Complete`,
    token: token,
  });
  return response.data;
};

const rejectRequestUpgrade = async (
  token: string,
  id: string
): Promise<any> => {
  const response = await httpClient.put({
    url: apiLinks.requestUpgrade.reject + `/${id}/Reject`,
    token: token,
  });
  return response.data;
};

const requestUpgrade = {
  getData,
  removeData,
  getAppointmentsById,
  createData,
  updateData,
  deleteData,
  getDetail,
  acceptRequestUpgrade,
  denyRequestUpgrade,
  completeRequestUpgrade,
  rejectRequestUpgrade,
};

export default requestUpgrade;
