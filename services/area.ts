import { ParamGet } from "@models/base";
import { AreaCreateModel, AreaUpdateModel, AreaData, Area } from "@models/area";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";
import { Rack, RackData } from "@models/rack";

const getData = async (token: string, params: ParamGet): Promise<AreaData> => {
  const response = await httpClient.get({
    token: token,
    url: apiLinks.area.get,
    params: params,
  });
  return response.data;
};

const getDataById = async (token: string, id: string): Promise<Area> => {
  const response = await httpClient.get({
    url: apiLinks.area.get + `/${id}`,
    token: token,
  });
  return response.data;
};

const getRackDataById = async (token: string, id: string): Promise<RackData> => {
  const response = await httpClient.get({
    url: apiLinks.area.get + `/${id}/Rack`,
    token: token,
  });
  return response.data;
};

const createData = async (
  token: string,
  data: AreaCreateModel
): Promise<any> => {
  const response = await httpClient.post({
    token: token,
    url: apiLinks.area.create,
    data: data,
  });
  return response.data;
};

const updateData = async (
  token: string,
  data: AreaUpdateModel
): Promise<any> => {
  const response = await httpClient.put({
    token: token,
    url: apiLinks.area.update,
    data: data,
  });
  return response.data;
};

const deleteData = async (token: string, id: number): Promise<any> => {
  const response = await httpClient.delete({
    url: apiLinks.area.delete + `/${id}`,
    token: token,
  });
  return response.data;
};

const area = {
  getData,
  getDataById,
  getRackDataById,
  updateData,
  deleteData,
  createData,
};

export default area;
