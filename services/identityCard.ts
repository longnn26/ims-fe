import {
  IdentityCardImageModel,
  IdentityCardModel,
} from "@models/identityCard";
import apiLinks from "@utils/api-links";
import { ContentTypeEnum } from "@utils/enum";
import httpClient from "@utils/http-client";

const getIdentityCard = async (
  token: string,
  driverId: string
): Promise<any> => {
  const response = await httpClient.get({
    url: `${apiLinks.identityCard.getIdentityCard}/${driverId}`,
    token: token,
  });
  return response.data;
};

const createIdentityCardByAdmin = async (
  token: string,
  model: IdentityCardModel,
  driverId: string
): Promise<any> => {
  const response = await httpClient.post({
    contentType: ContentTypeEnum.APPLICATION_JSON_PATCH,
    url: `${apiLinks.identityCard.createIdentityCardByAdmin}/${driverId}`,
    token: token,
    data: model,
  });
  return response.data;
};

const getIdentityCardImages = async (
  token: string,
  identityCardId: string
): Promise<any> => {
  const response = await httpClient.get({
    url: `${apiLinks.identityCard.getIdentityCardImage}/${identityCardId}`,
    token: token,
  });
  return response.data;
};

const addIdentityCardImageByAdmin = async (
  token: string,
  model: IdentityCardImageModel
): Promise<any> => {
  const response = await httpClient.post({
    contentType: ContentTypeEnum.MULTIPART,
    url: `${apiLinks.identityCard.addIdentityCardImageByAdmin}`,
    token: token,
    data: model,
  });
  return response.data;
};

const identityCard = {
  getIdentityCard,
  getIdentityCardImages,
  createIdentityCardByAdmin,
  addIdentityCardImageByAdmin,
};

export default identityCard;
