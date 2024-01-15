import { LocationData, LocationParamGet } from "@models/location";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getData = async (token: string, params: LocationParamGet): Promise<LocationData> => {
    const response = await httpClient.get({
      token: token,
      url: apiLinks.location.get,
      params: params,
    });
    return response.data;
  };

  const location = {
    getData,
  };
  
  export default location;