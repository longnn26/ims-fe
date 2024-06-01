import { ParamGet, ParamGetWithId } from "@models/base";
import { TransactionListData, WithdrawFundsId } from "@models/transaction";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getAllRequestWithdrawFundsByAdmin = async (
  token: string,
  params?: ParamGet
): Promise<TransactionListData> => {
  const response = await httpClient.get({
    url: `${apiLinks.request.getAllRequestWithdrawFundsByAdmin}`,
    token: token,
    params: params,
  });
  return response.data;
};

const acceptWithdrawFunds = async (
  token: string,
  model: WithdrawFundsId
): Promise<any> => {
  const response = await httpClient.put({
    url: apiLinks.request.acceptWithdrawFundsRequest,
    token: token,
    data: model,
  });
  return response.data;
};

const rejectWithdrawFunds = async (
  token: string,
  model: WithdrawFundsId
): Promise<any> => {
  const response = await httpClient.put({
    url: apiLinks.request.rejectWithdrawFundsRequest,
    token: token,
    data: model,
  });
  return response.data;
};

const transaction = {
  getAllRequestWithdrawFundsByAdmin,
  acceptWithdrawFunds,
  rejectWithdrawFunds,
};

export default transaction;
