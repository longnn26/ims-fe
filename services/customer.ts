import { ParamGet, ParamGetWithId } from "@models/base";
import {
  CustomerCreateModel,
  CustomerUpdateModel,
  CustomerData,
  CusParam,
  ChangePassword,
} from "@models/customer";
import { LoginResponse } from "@models/user";
import apiLinks from "@utils/api-links";
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

const customer = {
  getCustomerProfile,
  login,
  changePassword,
  changeStaffStatusOnline,
  changeStaffStatusOffline,
};

export default customer;
