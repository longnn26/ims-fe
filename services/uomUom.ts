import {
  UomUomCreate,
  UomUomPaging,
  UomUomUpdateFactor,
  UomUomUpdateInfo,
  UomUomUpdateType,
} from "@models/uomUom";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getUomUoms = async (
  token?: string,
  uomCategoryId?: string,
  pageIndex?: number,
  pageSize?: number
): Promise<UomUomPaging> => {
  const response = await httpClient.get({
    token: token,
    url: `${apiLinks.uomCategory.getUomUom}/${uomCategoryId}`,
    params: { pageIndex, pageSize },
  });
  return response.data;
};

const updateUomUomInfo = async (
  token?: string,
  data?: UomUomUpdateInfo
): Promise<any> => {
  const response = await httpClient.put({
    token: token,
    url: apiLinks.uomUom.updateInfo,
    data: data,
  });
  return response.data;
};

const updateUomUomFactor = async (
  token?: string,
  data?: UomUomUpdateFactor
): Promise<any> => {
  const response = await httpClient.put({
    token: token,
    url: apiLinks.uomUom.updateFactor,
    data: data,
  });
  return response.data;
};

const updateUomUomType = async (
  token?: string,
  data?: UomUomUpdateType
): Promise<any> => {
  const response = await httpClient.put({
    token: token,
    url: apiLinks.uomUom.updateType,
    data: data,
  });
  return response.data;
};

const createUomUom = async (
  token?: string,
  data?: UomUomCreate
): Promise<any> => {
  (data!.name = "New"),
    (data!.uomType = "Bigger"),
    (data!.factor = 1),
    (data!.rounding = 0.01),
    (data!.active = true);
  const response = await httpClient.post({
    token: token,
    url: apiLinks.uomUom.create,
    data: data,
  });
  return response.data;
};

const deleteUomUom = async (token?: string, id?: string): Promise<any> => {
  const response = await httpClient.delete({
    token: token,
    url: `${apiLinks.uomUom.delete}/${id}`,
  });
  return response.data;
};

const uomUom = {
  getUomUoms,
  updateUomUomInfo,
  updateUomUomFactor,
  updateUomUomType,
  createUomUom,
  deleteUomUom,
};

export default uomUom;
