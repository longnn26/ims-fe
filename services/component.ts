import { ParamGet } from "@models/base";
import {
  ComponentCreateModel,
  ComponentUpdateModel,
  ComponentData,
  ComponentObj,
} from "@models/component";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getComponentData = async (
  token: string,
  params: ParamGet
): Promise<ComponentData> => {
  const response = await httpClient.get({
    token: token,
    url: apiLinks.component.get,
    params: params,
  });
  return response.data;
};

const getComponentAll = async (token: string): Promise<ComponentObj[]> => {
  const response = await httpClient.get({
    token: token,
    url: apiLinks.component.getAll,
  });
  return response.data;
};

const createComponent = async (
  token: string,
  data: ComponentCreateModel
): Promise<any> => {
  const response = await httpClient.post({
    token: token,
    url: apiLinks.component.create,
    data: data,
  });
  return response.data;
};

const updateComponent = async (
  token: string,
  data: ComponentUpdateModel
): Promise<any> => {
  const response = await httpClient.put({
    token: token,
    url: apiLinks.component.create,
    data: data,
  });
  return response.data;
};

const deleteComponent = async (token: string, id: number): Promise<any> => {
  const response = await httpClient.delete({
    url: apiLinks.component.delete + `/${id}`,
    token: token,
  });
  return response.data;
};

const component = {
  getComponentData,
  getComponentAll,
  createComponent,
  updateComponent,
  deleteComponent,
};

export default component;
