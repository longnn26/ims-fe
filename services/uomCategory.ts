import { ParamGet } from "@models/base";
import {
  UomCategory,
} from "@models/uomCategory";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getUomCategories = async (
  token?: string,
  params?: ParamGet
): Promise<UomCategory[]> => {
  const response = await httpClient.get({
    token: token,
    url: apiLinks.uomCategory.get,
    params: params,
  });
  return response.data;
};

const uomCategory = {
  getUomCategories,
};

export default uomCategory;
