import {
  Appointment,
  AppointmentComplete,
  AppointmentData,
  ParamGetExtend,
} from "@models/appointment";
import {
  RUAppointmentParamGet,
  RequestUpgradeData,
} from "@models/requestUpgrade";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getListAppointments = async (
  token: string,
  params: RUAppointmentParamGet
): Promise<AppointmentData> => {
  const response = await httpClient.get({
    url: apiLinks.appointment.get,
    token: token,
    params: params,
  });
  return response.data;
};

const getDetail = async (token: string, id: string): Promise<Appointment> => {
  const response = await httpClient.get({
    url: apiLinks.appointment.getById + `/${id}`,
    token: token,
  });
  return response.data;
};

const getRequestUpgradesById = async (
  token: string,
  params: ParamGetExtend
): Promise<RequestUpgradeData> => {
  const response = await httpClient.get({
    url:
      apiLinks.appointment.getRequestUpgradesById +
      `/${params.Id}/RequestUpgrade`,
    token: token,
  });
  return response.data;
};

const acceptAppointment = async (token: string, id: string): Promise<any> => {
  const response = await httpClient.put({
    url: apiLinks.appointment.accept + `/${id}/Accept`,
    token: token,
  });
  return response.data;
};

const denyAppointment = async (token: string, id: string): Promise<any> => {
  const response = await httpClient.put({
    url: apiLinks.appointment.accept + `/${id}/Deny`,
    token: token,
  });
  return response.data;
};

const completeAppointment = async (
  token: string,
  id: string,
  data: AppointmentComplete
): Promise<any> => {
  const response = await httpClient.put({
    url: apiLinks.appointment.complete + `/${id}/Complete`,
    token: token,
    data: data,
  });
  return response.data;
};

const failAppointment = async (
  token: string,
  id: string,
  data: string
): Promise<any> => {
  const response = await httpClient.put({
    url: apiLinks.appointment.fail + `/${id}/Fail`,
    token: token,
    data: data,
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
    url: apiLinks.appointment.upload + `/${id}/Document`,
    token: token,
    data: data,
  });
  return response.data;
};

const appointment = {
  getListAppointments,
  getDetail,
  uploadDocument,
  getRequestUpgradesById,
  acceptAppointment,
  denyAppointment,
  completeAppointment,
  failAppointment,
};

export default appointment;
