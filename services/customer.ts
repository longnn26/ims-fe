import { ParamGet, ParamGetWithId } from "@models/base";
import {
  CustomerCreateModel,
  CustomerUpdateModel,
  CustomerData,
  CusParam,
  ChangePassword,
} from "@models/customer";
import {
  DriverCreateModel,
  LoginResponse,
  User,
  UserId,
  UserListData,
} from "@models/user";
import apiLinks from "@utils/api-links";
import { ContentTypeEnum } from "@utils/enum";
import httpClient from "@utils/http-client";

const getCustomerProfile = async (token: string): Promise<any> => {
  const response = await httpClient.get({
    url: apiLinks.customer.getProfile,
    token: token,
  });
  return response.data;
};

const changePassword = async (
  token: string,
  model: ChangePassword
): Promise<any> => {
  const response = await httpClient.put({
    url: apiLinks.customer.changePassword,
    token: token,
    data: model,
  });
  return response.data;
};

const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await httpClient.post({
    url: apiLinks.customer.login,
    data: {
      email: email,
      password: password,
    },
  });
  return response.data;
};

const changeStaffStatusOnline = async (token: string): Promise<any> => {
  const response = await httpClient.put({
    url: apiLinks.customer.changeStaffStatusOnline,
    token: token,
  });
  return response.data;
};

const changeStaffStatusOffline = async (token: string): Promise<any> => {
  const response = await httpClient.put({
    url: apiLinks.customer.changeStaffStatusOffline,
    token: token,
  });
  return response.data;
};

const getAllUserByAdmin = async (
  token: string,
  params?: ParamGet
): Promise<UserListData> => {
  const response = await httpClient.get({
    url: apiLinks.customer.getAllUserByAdmin,
    token: token,
    params: params,
  });
  return response.data;
};

const banAccount = async (token: string, model: UserId): Promise<any> => {
  const response = await httpClient.put({
    url: apiLinks.customer.banAccount,
    token: token,
    data: model,
  });
  return response.data;
};

const unBanAccount = async (token: string, model: UserId): Promise<any> => {
  const response = await httpClient.put({
    url: apiLinks.customer.unBanAccount,
    token: token,
    data: model,
  });
  return response.data;
};

const createDriverAccount = async (
  token: string,
  model: DriverCreateModel
): Promise<any> => {
  const response = await httpClient.post({
    contentType: ContentTypeEnum.MULTIPART,
    url: apiLinks.customer.createDriver,
    token: token,
    data: model,
  });
  return response.data;
};

const createStaffAccount = async (
  token: string,
  model: DriverCreateModel
): Promise<any> => {
  const response = await httpClient.post({
    contentType: ContentTypeEnum.MULTIPART,
    url: apiLinks.customer.createStaff,
    token: token,
    data: model,
  });
  return response.data;
};

const customer = {
  getCustomerProfile,
  login,
  changePassword,
  changeStaffStatusOnline,
  changeStaffStatusOffline,
  getAllUserByAdmin,
  unBanAccount,
  banAccount,
  createDriverAccount,
  createStaffAccount,
};

export default customer;
