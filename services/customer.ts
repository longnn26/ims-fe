import { ParamGet, ParamGetWithId } from "@models/base";
import {
  CustomerCreateModel,
  CustomerUpdateModel,
  CustomerData,
} from "@models/customer";
import {LoginResponse} from "@models/user"
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getData = async (
  token: string,
  params: ParamGet
): Promise<CustomerData> => {
  const response = await httpClient.get({
    token: token,
    url: apiLinks.customer.get,
    params: params,
  });
  return response.data;
};

const getCustomerById = async (
  token: string,
  id: string,
): Promise<any> => {
  const response = await httpClient.get({
    url: apiLinks.customer.get + `/${id}`,
    token: token,
  });
  return response.data;
};

const getCompanyByTax = async (
  taxNumber: string
): Promise<any> => {
  const response = await httpClient.get({
    url: apiLinks.customer.getByTax + `/${taxNumber}`,
    data: taxNumber,
  });
  return response.data;
};

const getServerById = async (
  token: string,
  id: string,
  params?: ParamGet,
): Promise<any> => {
  const response = await httpClient.get({
    token: token,
    url: apiLinks.customer.getServerAllocationById + `/${id}/ServerAllocation`,
    params: params,
  });
  return response.data;
}

const createData = async (
  token: string,
  data: CustomerCreateModel
): Promise<any> => {
  const response = await httpClient.post({
    token: token,
    url: apiLinks.customer.create,
    data: data,
  });
  return response.data;
};

const updateData = async (
  token: string,
  data: CustomerUpdateModel
): Promise<any> => {
  const response = await httpClient.put({
    token: token,
    url: apiLinks.customer.update,
    data: data,
  });
  return response.data;
};

const deleteData = async (token: string, id: string): Promise<any> => {
  const response = await httpClient.delete({
    url: apiLinks.customer.delete + `/${id}`,
    token: token,
  });
  return response.data;
};

const changePassword = async (token: string, currentPass: string, password: string): Promise<any> => {
  const response = await httpClient.put({
    url: apiLinks.customer.changePassword,
    token: token,
    data: {
      currentPassword: currentPass,
      password: password
    }
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

const customer = {
  getData,
  updateData,
  deleteData,
  createData,
  getCompanyByTax,
  getCustomerById,
  getServerById,
  login,
  changePassword
};

export default customer;
