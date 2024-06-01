import { ParamGet, ParamGetWithId } from "@models/base";
import { TransactionListData } from "@models/transaction";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getAllWalletTransactionByAdmin = async (
  token: string,
  params?: ParamGet
): Promise<TransactionListData> => {
  const response = await httpClient.get({
    url: `${apiLinks.transaction.getAllWalletTransactionByAdmin}`,
    token: token,
    params: params,
  });
  return response.data;
};

const transaction = {
  getAllWalletTransactionByAdmin,
};

export default transaction;
