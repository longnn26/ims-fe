import { InformationDC } from "@models/informationDC";

import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getData = async (token: string): Promise<any> => {
  const response = await httpClient.get({
    token: token,
    url: apiLinks.informationDC.get,
  });
  return response.data;
};

const updateData = async (token: string, data: InformationDC): Promise<any> => {
  const response = await httpClient.put({
    token: token,
    url: apiLinks.informationDC.update,
    data: data,
  });
  return response.data;
};

const informationDC = {
  getData,
  updateData,
};

export default informationDC;
