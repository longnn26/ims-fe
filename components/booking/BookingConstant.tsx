import { MenuProps } from "antd";
import { BiCheck, BiDetail } from "react-icons/bi";
import { GrTransaction } from "react-icons/gr";
import { IoMdPersonAdd } from "react-icons/io";
import { MdOutlineCancel } from "react-icons/md";

export const items: MenuProps["items"] = [
  {
    key: "1",
    label: <p>Thông tin chi tiết</p>,
    icon: <BiDetail />,
  },
];

export const categoriesDetail = [
  { key: "BookingInfo", label: "Thông tin chuyến đi" },
  { key: "CustomerInfo", label: "Thông tin khách hàng" },
  { key: "DriverInfo", label: "Thông tin tài xế" },
];
