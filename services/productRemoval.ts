import { ProductRemoval } from "@models/productRemoval";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getForSelect = async (
  token?: string,
  id?: string
): Promise<ProductRemoval[]> => {
  const response = await httpClient.get({
    token: token,
    url: `${apiLinks.productRemoval.getSelect}`,
  });
  return response.data;
};

const productRemoval = {
  getForSelect,
};

export default productRemoval;
