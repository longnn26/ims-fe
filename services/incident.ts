import { ParamGet } from "@models/base";
import { IncidentData, IncindentResolve } from "@models/incident";
import { IncidentCreateModel } from "@models/serverAllocation";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getData = async (
  token: string,
  params: ParamGet
): Promise<IncidentData> => {
  const response = await httpClient.get({
    token: token,
    url: `${apiLinks.incident.get}`,
    params: params,
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
  data: IncindentResolve
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
  createIncident,
  resolveIncident,
};

export default incident;
