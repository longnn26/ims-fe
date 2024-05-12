import { ChangePassword } from "@models/user";
import { LoginResponse, User, UserTechData, UserData, UserCreateModel, UserUpdateModel, UserUpdateRole } from "@models/user";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await httpClient.post({
    url: apiLinks.user.login,
    data: {
      email: email,
      password: password,
    },
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

const getUserProfile = async (
  token: string,
): Promise<User> => {
  const response = await httpClient.get({
    token: token,
    url: apiLinks.user.profile,
  });
  return response.data;
}

const changePassword = async (token: string, model: ChangePassword): Promise<any> => {
  const response = await httpClient.put({
    url: apiLinks.user.changePassword,
    token: token,
    data: model
  });
  return response.data;
};

const authService = {
  login,
  seenCurrentNoticeCount,
  getUserProfile,
  changePassword
};

export default authService;
