import {
  UomUomPaging,
} from "@models/uomUom";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getUomUoms = async (
  token?: string,
  uomCategoryId?: string,
  pageIndex?: number,
  pageSize?: number,
): Promise<UomUomPaging> => {
  const response = await httpClient.get({
    token: token,
    url: `${apiLinks.uomCategory.getUomUom}/${uomCategoryId}`,
    params: {pageIndex, pageSize},
  });
  return response.data;
};

const uomUom = {
  getUomUoms,
};

export default uomUom;
