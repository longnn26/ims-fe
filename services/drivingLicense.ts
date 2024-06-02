import {
  DrivingLicenseCardModel,
  DrivingLicenseImageCard,
} from "@models/drivingLicense";
import apiLinks from "@utils/api-links";
import { ContentTypeEnum } from "@utils/enum";
import httpClient from "@utils/http-client";

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
  createDrivingLicenseByAdmin,
  addDrivingLicenseImageByAdmin,
};

export default drivingLicense;
