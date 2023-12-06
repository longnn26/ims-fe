import { ParamGet } from "@models/base";
import { LoginResponse, UserTechData } from "@models/user";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const response = await httpClient.post({
    url: apiLinks.user.login,
    data: {
      username: username,
      password: password,
    },
  });
  return response.data;
};

const getUserTechData = async (
  token: string,
  params: ParamGet
): Promise<UserTechData> => {
  const response = await httpClient.get({
    token: token,
    url: apiLinks.user.getUserTech,
    params: params,
  });
  return response.data;
};

const authService = {
  login,
  getUserTechData,
};

export default authService;
