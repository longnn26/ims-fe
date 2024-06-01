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
    danger: true,
    label: <p className="text-red-600">Ban tài khoản</p>,
    icon: <MdOutlineCancel className="text-red-600" />,
  },
  {
    key: "3",
    label: <p className="text-green-600">Gỡ ban tài khoản</p>,
    icon: <BiCheck className="text-green-600" />,
  },
];

export const categoriesDetail = [
  { key: "AccountInfo", label: "Thông tin cá nhân" },
  { key: "IdentityCardInfo", label: "Căn cước công dân" },
  { key: "VehicleInfo", label: "Thông tin chiếc xe" },
  { key: "DrivingLicenseInfo", label: "Thông tin bằng lái xe" },
  { key: "LinkedAccountInfo", label: "Thông tin liên kết" },
];

