import { LinkedAccountType, ListBankType } from "@models/linkedAccount";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getLinkedAccountByAdmin = async (
  token: string,
  userId?: string
): Promise<LinkedAccountType> => {
  const response = await httpClient.get({
    url: `${apiLinks.linkedAccount.getLinkedAccountByAdmin}/${userId}`,
    token: token,
  });
  return response.data;
};

const getAllBankInfo = async (): Promise<ListBankType> => {
  const response = await httpClient.get({
    url: `${apiLinks.linkedAccount.getAllBank}`,
  });
  return response.data;
};

const linkedAccount = {
  getLinkedAccountByAdmin,
  getAllBankInfo,
};

export default linkedAccount;
