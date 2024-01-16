import { AppointmentData } from "@models/appointment";
import { ParamGet } from "@models/base";
import {
  RequestedLocation,
  RequestExpand,
  RequestExpandCreateModel,
  RequestExpandData,
  RequestExpandUpdateModel,
  SuggestLocation,
} from "@models/requestExpand";
import { RUAppointmentParamGet } from "@models/requestUpgrade";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getData = async (
  token: string,
  params: ParamGet
): Promise<RequestExpandData> => {
  const response = await httpClient.get({
    token: token,
    url: `${apiLinks.requestExpand.get}`,
    params: params,
  });
  return response.data;
};

const createData = async (
  token: string,
  data: RequestExpandCreateModel
): Promise<any> => {
  const response = await httpClient.post({
    contentType: "multipart/form-data",
    token: token,
    url: apiLinks.requestExpand.create,
    data: data,
  });
  return response.data;
};

const getDetail = async (token: string, id: string): Promise<RequestExpand> => {
  const response = await httpClient.get({
    url: apiLinks.requestExpand.getById + `/${id}`,
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
      apiLinks.requestExpand.getAppointmentsById + `/${params.Id}/Appointment`,
    token: token,
  });
  return response.data;
};

const getSuggestLocation = async (
  token: string,
  id: number
): Promise<SuggestLocation> => {
  const response = await httpClient.get({
    url: apiLinks.requestExpand.getSuggestLocation + `/${id}/SuggestLocation`,
    token: token,
  });
  return response.data;
};

const acceptRequestExpand = async (
  token: string,
  id: string,
  data: string
): Promise<any> => {
  const response = await httpClient.put({
    url: apiLinks.requestExpand.accept + `/${id}/Accept`,
    token: token,
    data: { saleNote: data },
  });
  return response.data;
};

const denyRequestExpand = async (
  token: string,
  id: string,
  data: string
): Promise<any> => {
  const response = await httpClient.put({
    url: apiLinks.requestExpand.accept + `/${id}/Deny`,
    token: token,
    data: { saleNote: data },
  });
  return response.data;
};

const completeRequestExpand = async (
  token: string,
  id: string
): Promise<any> => {
  const response = await httpClient.put({
    url: apiLinks.requestExpand.complete + `/${id}/Complete`,
    token: token,
  });
  return response.data;
};

const rejectRequestExpand = async (token: string, id: string): Promise<any> => {
  const response = await httpClient.put({
    url: apiLinks.requestExpand.reject + `/${id}/Reject`,
    token: token,
  });
  return response.data;
};

const updateData = async (
  token: string,
  data: RequestExpandUpdateModel
): Promise<any> => {
  const response = await httpClient.put({
    token: token,
    url: apiLinks.requestExpand.update,
    data: data,
  });
  return response.data;
};

const saveLocation = async (
  token: string,
  id: number,
  data: RequestedLocation
): Promise<any> => {
  const response = await httpClient.post({
    token: token,
    url: apiLinks.requestExpand.saveLocation + `/${id}/RequestExpandLocation`,
    data: data,
  });
  return response.data;
};

const requestExpand = {
  getData,
  createData,
  getDetail,
  acceptRequestExpand,
  completeRequestExpand,
  rejectRequestExpand,
  denyRequestExpand,
  getAppointmentsById,
  updateData,
  getSuggestLocation,
  saveLocation,
};

export default requestExpand;
