import moment from "moment";
import { dateAdvFormat } from "./constants";
import dayjs from "dayjs";
import { MenuItem } from "@/types/next-auth-d";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";

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
    if (typeof key === "string") {
      return key.charAt(0).toLowerCase() + key.slice(1);
    }
    return value;
  });
};

export const parseJwt = (token) => {
  if (!token) {
    return;
  }
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

  return JSON.parse(window.atob(base64));
};

export const areInArray = (arr: any[], ...elements: any[]) => {
  for (let element of elements) {
    if (arr?.includes(element)) {
      return true;
    }
  }
  return false;
};

export const setsAreEqual = (set1, set2) => {
  if (set1.size !== set2.size) return false;
  for (let item of set1) {
    if (!set2.has(item)) return false;
  }
  return true;
};

export function getItem(
  label: React.ReactNode | string,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const handleTitleBreadCumb = (title) => {
  switch (title) {
    case "units-of-measure":
      return "Units of Measure";
    case "product-categories":
      return "Product Categories";
    case "attributes":
      return "Attributes";
    case "products":
      return "Products";
    case "warehouses":
      return "Warehouses";
    default:
      return title;
  }
};

export const handleBreadCumb = (router) => {
  var itemBrs = [] as ItemType[];
  var items = router.split("/");
  items.shift();
  items.pop();
  var path = "";
  items.forEach((element) => {
    path += `/${element}`;
    itemBrs.push({
      href: path,
      title: handleTitleBreadCumb(element),
    });
  });
  return itemBrs;
};
