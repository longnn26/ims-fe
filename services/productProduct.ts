import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const deleteProductProduct = async (
  token?: string,
  id?: string
): Promise<any> => {
  const response = await httpClient.delete({
    token: token,
    url: `${apiLinks.productProduct.delete}/${id}`,
  });
  return response.data;
};

const productProduct = {
  deleteProductProduct,
};

export default productProduct;
