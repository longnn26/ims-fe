import { ParamGet, ParamGetWithId } from "@models/base";
import { BookingListData } from "@models/booking";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getAllBookingByAdmin = async (
  token: string,
  params?: ParamGet
): Promise<BookingListData> => {
  const response = await httpClient.get({
    url: `${apiLinks.booking.getAllBookingByAdmin}`,
    token: token,
    params: params,
  });
  return response.data;
};

const booking = {
  getAllBookingByAdmin,
};

export default booking;
