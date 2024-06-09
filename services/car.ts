import { ParamGet, ParamGetWithId } from "@models/base";
import {
  BrandCarCreateType,
  BrandCarType,
  BrandCarUpdateType,
  ModelCarCreateType,
  ModelCarType,
  ModelCarUpdateType,
} from "@models/car";
import apiLinks from "@utils/api-links";
import { ContentTypeEnum } from "@utils/enum";
import httpClient from "@utils/http-client";

//brand
const addNewBrand = async (
  token: string,
  model: BrandCarCreateType
): Promise<any> => {
  const response = await httpClient.post({
    contentType: ContentTypeEnum.MULTIPART,
    url: `${apiLinks.car.addNewBrand}`,
    token: token,
    data: model,
  });
  return response.data;
};

const getAllBrand = async (token: string): Promise<any> => {
  const response = await httpClient.get({
    url: `${apiLinks.car.getAllBrand}`,
    token: token,
  });
  return response.data;
};

const updateSelectedBrand = async (
  token: string,
  model: BrandCarUpdateType
): Promise<any> => {
  const response = await httpClient.put({
    contentType: ContentTypeEnum.MULTIPART,
    url: `${apiLinks.car.updateSelectedBrand}`,
    token: token,
    data: model,
  });
  return response.data;
};

const deleteSelectedBrand = async (
  token: string,
  brandVehicleId: string
): Promise<any> => {
  const response = await httpClient.delete({
    url: `${apiLinks.car.deleteSelectedBrand}/${brandVehicleId}`,
    token: token,
  });
  return response.data;
};

//model
const addNewModel = async (
  token: string,
  model: ModelCarCreateType
): Promise<any> => {
  const response = await httpClient.post({
    url: `${apiLinks.car.addNewModel}`,
    token: token,
    data: model,
  });
  return response.data;
};

const getAllModelByBrandVehicleId = async (
  token: string,
  brandVehicleId: string
): Promise<any> => {
  const response = await httpClient.get({
    url: `${apiLinks.car.getAllModelByBrandVehicleId}/${brandVehicleId}`,
    token: token,
  });
  return response.data;
};

const updateSelectedModelByBrandVehicleId = async (
  token: string,
  model: ModelCarUpdateType
): Promise<any> => {
  const response = await httpClient.put({
    url: `${apiLinks.car.updateSelectedModelByBrandVehicleId}`,
    token: token,
    data: model,
  });
  return response.data;
};

const deleteSelectedModelByModelVehicleId = async (
  token: string,
  modelVehicleId: string
): Promise<any> => {
  const response = await httpClient.delete({
    url: `${apiLinks.car.deleteSelectedModelByModelVehicleId}/${modelVehicleId}`,
    token: token,
  });
  return response.data;
};

const car = {
  addNewBrand,
  getAllBrand,
  updateSelectedBrand,
  deleteSelectedBrand,
  addNewModel,
  updateSelectedModelByBrandVehicleId,
  deleteSelectedModelByModelVehicleId,
  getAllModelByBrandVehicleId,
};

export default car;
