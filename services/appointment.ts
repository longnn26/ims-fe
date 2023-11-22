import { Appointment, AppointmentData } from "@models/appointment";
import { RUAppointmentParamGet } from "@models/requestUpgrade";
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

const appointment = { getListAppointments, getDetail, uploadDocument };

export default appointment;
