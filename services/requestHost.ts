import { ParamGet } from "@models/base";
import { RequestHostData } from "@models/requestHost";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getData = async (
  token: string,
  params: ParamGet,
  id: number
): Promise<RequestHostData> => {
  const response = await httpClient.get({
    token: token,
    url: `${apiLinks.requestExpand.get}/${id}/RequestHost`,
    params: params,
  });
  return response.data;
};

const requestHost = {
  getData,
};

export default requestHost;
