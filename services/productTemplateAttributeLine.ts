import {
  ProductTemplateAttributeLinePaging,
  ProductTemplateAttributeLineCreate,
} from "@models/productTemplateAttributeLine";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getProductTemplateAttributeLines = async (
  token?: string,
  productTmplId?: string,
  pageIndex?: number,
  pageSize?: number
): Promise<ProductTemplateAttributeLinePaging> => {
  const response = await httpClient.get({
    token: token,
    url: `${apiLinks.productTemplate.getAttributeLine}/${productTmplId}`,
    params: { pageIndex, pageSize, SortKey: "CreateDate", SortOrder: "ASC" },
  });
  return response.data;
};

const createProductTemplateAttributeLine = async (
  token?: string,
  data?: ProductTemplateAttributeLineCreate
): Promise<any> => {
  const response = await httpClient.post({
    token: token,
    url: `${apiLinks.productTemplateAttributeLine.create}`,
    data: data,
  });
  return response.data;
};

const deleteProductTemplateAttributeLine = async (
  token?: string,
  id?: string
): Promise<any> => {
  const response = await httpClient.delete({
    token: token,
    url: `${apiLinks.productTemplateAttributeLine.delete}/${id}`,
  });
  return response.data;
};

const productTemplate = {
  getProductTemplateAttributeLines,
  createProductTemplateAttributeLine,
  deleteProductTemplateAttributeLine,
};

export default productTemplate;
