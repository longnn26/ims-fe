import moment from "moment";
import { dateAdvFormat } from "./constants";
import dayjs from "dayjs";

export const isExpiredTimeToken = (loginDate: string, exp: number): boolean => {
  const tokenExpiredTime = moment(loginDate).add(exp, "minute").toDate();
  const currentDate = moment().toDate();
  return tokenExpiredTime > currentDate;
};

export const convertDatePicker = (date: string, format: any) => {
  return dayjs(moment(date).format(format), format);
};

export const formatDobToYYYYMMDD = (dob: any) => {
  if (!dob || !dob.$d) {
    return "";
  }
  return dayjs(dob.$d).format("YYYY-MM-DD");
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

export const disableFutureDates = (current) => {
  return current && current > moment().endOf("day");
};

export const disablePastDates = (current) => {
  return current && current < moment().endOf("day");
};

export const formatDate = (inputDate: string | undefined) => {
  if (!inputDate) {
    return "(Chưa cập nhập)";
  }

  const date = new Date(inputDate);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const formatDateTimeToVnFormat = (inputString: string): string => {
  const date = new Date(inputString);
  if (isNaN(date.getTime())) {
    console.log("Không đúng format");
  }

  const padZero = (num: number) => num.toString().padStart(2, "0");

  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());
  const day = padZero(date.getDate());
  const month = padZero(date.getMonth() + 1); // Months are zero-based
  const year = date.getFullYear();

  return `${hours}:${minutes} - ${day}/${month}/${year}`;
};

export const convertToVietnamTimeInBooking = (utcTime: string | null) => {
  if (!utcTime || utcTime === "0001-01-01T00:00:00") {
    return "";
  }

  const dateUtc = new Date(utcTime);
  const vietnamTime = new Date(dateUtc.getTime());

  const formattedTime = `${("0" + vietnamTime.getHours()).slice(-2)}:${(
    "0" + vietnamTime.getMinutes()
  ).slice(-2)} - ${("0" + vietnamTime.getDate()).slice(-2)}/${(
    "0" +
    (vietnamTime.getMonth() + 1)
  ).slice(-2)}/${vietnamTime.getFullYear()}`;

  return formattedTime;
};

export const getColorByStatusClass = (status: string): string => {
  switch (status) {
    case "Pending":
    case "OnGoing":
      return "status-pending";
    case "Public":
    case "New":
    case "Arrived":
      return "status-public";
    case "Processing":
    case "InProcess":
      return "status-processing";
    case "Done":
    case "Active":
    case "Solved":
    case "Accept":
    case "Complete":
    case "Success":
      return "status-done";
    case "Expired":
    case "Pause":
    case "Rejected":
    case "Cancel":
    case "Failure":
      return "status-expired";
    case "End":
      return "status-end";
    case "CheckIn":
    case "CheckOut":
    case "PayBooking":
      return "status-checkin";
    default:
      return "status-default";
  }
};

export const translateTypeToVnLanguage = (type: string): string => {
  switch (type) {
    case "AddFunds":
      return "Nạp tiền vào ví";
    case "WithdrawFunds":
      return "Yêu cầu rút tiền";
    case "Income":
      return "Thu nhập từ chuyến đi";
    case "DriverIncome":
      return "Thu nhập của tài xế";
    case "Pay":
      return "Thanh toán chuyến đi";
    case "Refund":
      return "Hoàn tiền khi hủy chuyến";
    case "Recruitment":
      return "Đơn ứng tuyển";
    case "BookingIssue":
      return "Sự cố chuyến đi";
    case "SupportIssue":
      return "Hỗ trợ vấn đề";
    default:
      return type;
  }
};

export const translateStatusToVnLanguage = (status: string): string => {
  switch (status) {
    case "Accept":
      return "Đã chấp nhận";
    case "Arrived":
      return "Đã đến điểm đón";
    case "CheckIn":
      return "Đang chụp xác nhận";
    case "OnGoing":
      return "Đang di chuyển";
    case "CheckOut":
      return "Đang chụp xác nhận";
    case "Waiting":
    case "InProcess":
    case "Processing":
      return "Đang xử lý";
    case "Success":
      return "Thành công";
    case "Complete":
      return "Hoàn thành";
    case "PayBooking":
      return "Đang thanh toán";
    case "Cancel":
      return "Đã hủy cuốc";
    case "Failure":
      return "Không thành công";
    case "New":
      return "Mới";
    case "Pending":
      return "Đang chờ";
    case "Solved":
      return "Đã xử lý";
    case "Pause":
      return "Tạm thời không thể xử lý";
    default:
      return status;
  }
};

export const translateBookingInfoTOVnLanguage = (status: string): string => {
  switch (status) {
    case "MySelf":
      return "Đặt cá nhân";
    case "Someone":
      return "Đặt hộ";
    default:
      return status;
  }
};

export const splitString = (inputString: string): string => {
  if (inputString === null) {
    return "";
  }

  if (inputString.length > 60) {
    return inputString.substring(0, 60) + "...";
  } else {
    return inputString;
  }
};

export const truncateString = (input: string, maxLength: number): string => {
  if (input?.length > maxLength) {
    return `${input?.substring(0, maxLength)}...`;
  }
  return input;
};

export const getEmergencyTypeName = (type: number): string => {
  switch (type) {
    case 0:
      return "Chat";
    case 1:
      return "Call";
    case 2:
      return "Police";
    default:
      return "Unknown emergency type";
  }
};

export const removeHyphens = (str: string): string => {
  return str?.replace(/-/g, "");
};

export const formatCurrency = (num: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(num);
};

export const translateConfigurationPriceToVietnamese = (
  typePrice: string
): string => {
  switch (typePrice) {
    case "baseFareFirst3km":
      return "Giá mở cửa";
    case "fareFerAdditionalKm":
      return "Giá trên mỗi km";
    case "driverProfit":
      return "Lợi nhuận tài xế";
    case "appProfit":
      return "Lợi nhuận app";
    case "peakHours":
      return "Giá giờ cao điểm";
    case "nightSurcharge":
      return "Phí ban đêm";
    case "waitingSurcharge":
      return "Phí chờ đợi";
    case "weatherFee":
      return "Phí thời tiết";
    case "customerCancelFee":
      return "Phí khi khách hàng hủy quá nhiều";
    case "searchRadius":
      return "Bán kính tìm kiếm";
    default:
      return "Unknown configuration price text";
  }
};

export const translateVietnameseToConfigurationPrice = (
  vietnameseText: string
): string => {
  switch (vietnameseText) {
    case "Giá mở cửa":
      return "baseFareFirst3km";
    case "Giá trên mỗi km":
      return "fareFerAdditionalKm";
    case "Lợi nhuận tài xế":
      return "driverProfit";
    case "Lợi nhuận app":
      return "appProfit";
    case "Giá giờ cao điểm":
      return "peakHours";
    case "Phí ban đêm":
      return "nightSurcharge";
    case "Phí chờ đợi":
      return "waitingSurcharge";
    case "Phí thời tiết":
      return "weatherFee";
    case "Phí khi khách hàng hủy quá nhiều":
      return "customerCancelFee";
    case "Bán kính tìm kiếm":
      return "searchRadius";
    default:
      return "Unknown Vietnamese configuration price text";
  }
};

export const translateGenderToVietnamese = (vietnameseText: string): string => {
  switch (vietnameseText) {
    case "Male":
      return "Nam";
    case "Female":
      return "Nữ";
    case "Other":
      return "Khác";
    default:
      return "(Chưa cập nhập)";
  }
};

export const anotherOptionConfigurationPrice = (anotherOption: string) => {
  switch (anotherOption) {
    case "time":
      return "Khoảng thời gian tính";
    case "perMinutes":
      return "Số phút tính tiền một lần";
    case "distance":
      return "Phạm vi (trên km)";
  }
};

export const getBrandLogoPath = (brandName: string): string => {
  switch (brandName) {
    case "Toyota":
      return "/images/Toyota.png";
    case "Audi":
      return "/images/Audi.png";
    case "BMW":
      return "/images/BMW.png";
    case "KIA":
      return "/images/Kia.png";
    case "Ford":
      return "/images/Ford.png";
    case "Honda":
      return "/images/Honda.png";
    case "Lexus":
      return "/images/Lexus.png";
    case "Mazda":
      return "/images/Mazda.png";
    case "Vinfast":
      return "/images/Vinfast.png";
    case "Suzuki":
      return "/images/Suzuki.png";
    case "Mercedes":
      return "/images/Mercedes.png";
    case "Daewoo":
      return "/images/Daewoo.png";
    case "Hyundai":
      return "/images/Hyundai.png";
    default:
      return "/images/car_driving.png";
  }
};
