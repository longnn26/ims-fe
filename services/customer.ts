import { ParamGet } from "@models/base";
import {
  CustomerCreateModel,
  CustomerUpdateModel,
  CustomerData,
} from "@models/customer";
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
): Promise<any> => {
  const response = await httpClient.get({
    token: token,
    url: apiLinks.customer.getServerAllocationById + "/" + id + "/ServerAllocation",
    data: id
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

const deleteData = async (token: string, id: number): Promise<any> => {
  const response = await httpClient.delete({
    url: apiLinks.customer.delete + `/${id}`,
    token: token,
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
  getServerById
};

export default customer;
