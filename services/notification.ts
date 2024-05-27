import { ParamGet } from "../models/base";
import { NotificationData, Notification } from "../models/notification";
import apiLinks from "../utils/api-links";
import httpClient from "../utils/http-client";

const getNotifications = async (
  token: string,
  params?: ParamGet
): Promise<Notification[]> => {
  const response = await httpClient.get({
    token: token,
    url: apiLinks.notification.get,
    params: params,
  });
  return response.data;
};

const seenNotifications = async (
  token: string,
  id?: number,
  params?: ParamGet
): Promise<number> => {
  const response = await httpClient.put({
    token: token,
    url: `${apiLinks.notification.seenNotification}/${id}`,
    params: params,
  });
  return response.data;
};

const seenAllNotifications = async (token: string): Promise<number> => {
  const response = await httpClient.put({
    token: token,
    url: `${apiLinks.notification.seenAllNotification}`,
  });
  return response.data;
};

const notification = {
  getNotifications,
  seenNotifications,
  seenAllNotifications,
};

export default notification;
