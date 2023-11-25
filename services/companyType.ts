import { ParamGet } from "@models/base";
import { CompanyType } from "@models/companyType";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getCompanyTypes = async (token: string): Promise<CompanyType[]> => {
  const response = await httpClient.get({
    token: token,
    url: apiLinks.companyType.get,
  });
  return response.data;
};

const companyType = {
  getCompanyTypes,
};

export default companyType;
