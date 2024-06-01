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
  {
    key: "2",
    label: <p>Tiến hành giải quyết</p>,
    icon: <GrTransaction />,
  },
  {
    key: "3",
    label: <p className="text-green-600">Đánh dấu đã giải quyết</p>,
    icon: <BiCheck className="text-green-600" />,
  },
  {
    key: "4",
    danger: true,
    label: <p className="text-red-600">Hủy chuyến ngay</p>,
    icon: <MdOutlineCancel className="text-red-600" />,
  },
];

export const categoriesDetail = [
  { key: "EmergencyInfo", label: "Thông tin khẩn cấp" },
  { key: "BookingInfo", label: "Thông tin chuyến đi" },
  { key: "CustomerInfo", label: "Thông tin khách hàng" },
  { key: "DriverInfo", label: "Thông tin tài xế" },
];
