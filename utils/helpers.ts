import moment from "moment";
import { dateAdvFormat } from "./constants";
import dayjs from "dayjs";

export const isExpiredTimeToken = (loginDate: string, exp: number): boolean => {
  const tokenExpiredTime = moment(loginDate).add(exp, "minute").toDate();
  const currentDate = moment().toDate();
  return tokenExpiredTime > currentDate;
};

export const convertDatePicker = (date: string) => {
  return dayjs(moment(date).format(dateAdvFormat), dateAdvFormat);
};

export const customJsonParse = (jsonString: string) => {
  return JSON.parse(jsonString, (key, value) => {
    console.log(key);
    if (typeof key === "string") {
      return key.charAt(0).toLowerCase() + key.slice(1);
    }
    console.log(value);
    return value;
  });
};
