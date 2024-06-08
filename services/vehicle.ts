import { VehicleType } from "@models/vehicle";
import apiLinks from "@utils/api-links";
import { ContentTypeEnum } from "@utils/enum";
import httpClient from "@utils/http-client";

const getVehicleByCustomerId = async (
  token: string,
  customerId: string
): Promise<any> => {
  const response = await httpClient.get({
    url: `${apiLinks.vehicle.getVehicle}/${customerId}`,
    token: token,
  });
  return response.data;
};


const getVehicleImage = async (
  token: string,
  vehicleId: string
): Promise<any> => {
  const response = await httpClient.get({
    url: `${apiLinks.vehicle.getVehicleImage}/${vehicleId}`,
    token: token,
  });
  return response.data;
};

const vehicle = {
    getVehicleByCustomerId,
    getVehicleImage
};

export default vehicle;
