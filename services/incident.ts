import {
  Incident,
  IncidentData,
  IncidentCreateModel,
  IncidentParam,
  IncidentResolve,
  IncidentResolveModel,
} from "@models/incident";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getData = async (
  token: string,
  params: IncidentParam
): Promise<IncidentData> => {
  const response = await httpClient.get({
    token: token,
    url: `${apiLinks.incident.get}`,
    params: params,
  });
  return response.data;
};

const getDetail = async (token: string, id: string): Promise<Incident> => {
  const response = await httpClient.get({
    url: apiLinks.incident.getById + `/${id}`,
    token: token,
  });
  return response.data;
};

const createIncident = async (
  token: string,
  data: IncidentCreateModel
): Promise<any> => {
  const response = await httpClient.post({
    token: token,
    url: apiLinks.incident.create,
    data: data,
  });
  return response.data;
};

const resolveIncident = async (
  token: string,
  id: number,
  data: IncidentResolveModel
): Promise<any> => {
  const response = await httpClient.put({
    url: apiLinks.incident.resolve + `/${id}/Resolve`,
    token: token,
    data: { solution: data.solution },
  });
  return response.data;
};

const resolveAppointment = async (
  token: string,
  id: number,
  data: IncidentResolve
): Promise<any> => {
  const response = await httpClient.put({
    url: apiLinks.incident.resolveAppointment + `/${id}/Resolv`,
    token: token,
    data: data,
  });
  return response.data;
};

const incident = {
  getData,
  getDetail,
  createIncident,
  resolveIncident,
  resolveAppointment,
};

export default incident;
