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
  { key: "RequestInfo", label: "Thông tin chi tiết" },
  { key: "LinkedAccountInfo", label: "Tài khoản liên kết" },
];