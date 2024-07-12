import {
  UomCategoryInfo,
  UomCategoryPaging,
} from "@models/uomCategory";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getUomCategories = async (
  token?: string,
  pageIndex?: number,
  pageSize?: number,
): Promise<UomCategoryPaging> => {
  const response = await httpClient.get({
    token: token,
    url: apiLinks.uomCategory.get,
    params: {pageIndex, pageSize},
  });
  return response.data;
};

const getUomCategoryInfo = async (
  token?: string,
  id?: string
): Promise<UomCategoryInfo> => {
  const response = await httpClient.get({
    token: token,
    url: `${apiLinks.uomCategory.getInfo}/${id}`,
  });
  return response.data;
};

const uomCategory = {
  getUomCategories,
  getUomCategoryInfo
};

export default uomCategory;
