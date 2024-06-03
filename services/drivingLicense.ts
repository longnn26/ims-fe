import {
  DrivingLicenseCardModel,
  DrivingLicenseImageCard,
} from "@models/drivingLicense";
import apiLinks from "@utils/api-links";
import { ContentTypeEnum } from "@utils/enum";
import httpClient from "@utils/http-client";

const getDrivingLicense = async (
  token: string,
  driverId: string
): Promise<any> => {
  const response = await httpClient.get({
    url: `${apiLinks.drivingLicense.getDrivingLicense}/${driverId}`,
    token: token,
  });
  return response.data;
};

const createDrivingLicenseByAdmin = async (
  token: string,
  model: DrivingLicenseCardModel,
  driverId: string
): Promise<any> => {
  const response = await httpClient.post({
    contentType: ContentTypeEnum.APPLICATION_JSON_PATCH,
    url: `${apiLinks.drivingLicense.createDrivingLicenseByAdmin}/${driverId}`,
    token: token,
    data: model,
  });
  return response.data;
};

const getDrivingLicenseImage = async (
  token: string,
  drivingLicenseId: string
): Promise<any> => {
  const response = await httpClient.get({
    url: `${apiLinks.drivingLicense.getDrivingLicenseImage}/${drivingLicenseId}`,
    token: token,
  });
  return response.data;
};

const addDrivingLicenseImageByAdmin = async (
  token: string,
  model: DrivingLicenseImageCard
): Promise<any> => {
  const response = await httpClient.post({
    contentType: ContentTypeEnum.MULTIPART,
    url: `${apiLinks.drivingLicense.addDrivingLicenseImageByAdmin}`,
    token: token,
    data: model,
  });
  return response.data;
};

const drivingLicense = {
  getDrivingLicense,
  getDrivingLicenseImage,
  createDrivingLicenseByAdmin,
  addDrivingLicenseImageByAdmin,
};

export default drivingLicense;
