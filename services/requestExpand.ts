import { ParamGet } from "@models/base";
import { RequestExpandData } from "@models/requestExpand";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getData = async (
  token: string,
  params: ParamGet,
  id: number
): Promise<RequestExpandData> => {
  const response = await httpClient.get({
    token: token,
    url: `${apiLinks.requestExpand.get}/${id}/RequestExpand`,
    params: params,
  });
  return response.data;
};

const requestExpand = {
  getData,
};

export default requestExpand;
