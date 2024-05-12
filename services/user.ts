import { ParamGet } from "@models/base";
import { LoginResponse, User, UserTechData, UserData, UserCreateModel, UserUpdateModel, UserUpdateRole } from "@models/user";
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

const seenCurrentNoticeCount = async (token: string): Promise<User> => {
  const response = await httpClient.post({
    url: apiLinks.user.seenCurrentNoticeCount,
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

const update = async (
  token: string,
  data: UserUpdateModel
): Promise<any> => {
  const response = await httpClient.patch({
    token: token,
    url: apiLinks.user.update,
    data: data,
  });
  return response.data;
}

const addRole = async (
  token: string,
  data: UserUpdateRole
): Promise<any> => {
  const response = await httpClient.post({
    token: token,
    url: apiLinks.user.updateRole,
    data: data,
  });
  return response.data;
}

const deleteRole = async (
  token: string,
  data: UserUpdateRole
): Promise<any> => {
  const response = await httpClient.delete({
    token: token,
    url: apiLinks.user.updateRole,
    data: data,
  });
  return response.data;
}

const changePassword = async (
  token: string,
  data: UserUpdateRole
): Promise<any> => {
  const response = await httpClient.put({
    token: token,
    url: apiLinks.user.updateRole,
    data: data,
  });
  return response.data;
}

const authService = {
  login,
  getUserTechData,
  seenCurrentNoticeCount,
  getUserData,
  getUserDetailData,
  create,
  update,
  addRole,
  deleteRole,
};

export default authService;
