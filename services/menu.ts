import { AssignCategory, MenuItemPublic, MenuRequestPublic } from "@models/menu";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getCategoryIds = async (
  token: string,
  normalizedName: string
): Promise<string[]> => {
  const response = await httpClient.get({
    url: apiLinks.menu.getCategoryIds + `/${normalizedName}`,
    token: token,
  });
  return response.data;
};

const assignCategory = async (
  token: string,
  data: AssignCategory
): Promise<string[]> => {
  const response = await httpClient.post({
    url: apiLinks.menu.assignCategory,
    token: token,
    data: data,
  });
  return response.data;
};

const getMenuPublic = async (request: MenuRequestPublic): Promise<MenuItemPublic[]> => {
  const response = await httpClient.get({
    url: apiLinks.menu.getMenuPublic,
    params: request
  });
  return response.data;
};

const menuService = {
  getCategoryIds,
  assignCategory,
  getMenuPublic,
};

export default menuService;
