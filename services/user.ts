import { ParamGet } from "@models/base";
import { LoginResponse, User, UserTechData, UserData, UserCreateModel } from "@models/user";
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

const seenCurrenNoticeCount = async (token: string): Promise<User> => {
  const response = await httpClient.post({
    url: apiLinks.user.seenCurrenNoticeCount,
    token: token,
  });
  return response.data;
};

const getUserData = async (
  token: string,
  params: ParamGet
): Promise<UserData> => {
  const response = await httpClient.get({
    token: token,
    url: apiLinks.user.get,
    params: params,
  });
  return response.data;
}

const getUserDetailData = async (
  token: string,
  id: string
): Promise<User> => {
  const response = await httpClient.get({
    token: token,
    url: apiLinks.user.get + `/${id}`,
  });
  return response.data;
}

const create = async (
  token: string,
  data: UserCreateModel
): Promise<any> => {
  const response = await httpClient.post({
    token: token,
    url: apiLinks.user.create,
    data: data,
  });
  return response.data;
}

const authService = {
  login,
  getUserTechData,
  seenCurrenNoticeCount,
  getUserData,
  getUserDetailData,
  create,
};

export default authService;
