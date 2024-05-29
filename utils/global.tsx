import { ReactNode } from "react";
import { AiFillSchedule } from "react-icons/ai";
import { BiSolidUserAccount } from "react-icons/bi";
import { MdOutlineSupportAgent } from "react-icons/md";
import { TbLayoutDashboard } from "react-icons/tb";
import { GrDocumentConfig } from "react-icons/gr";
import { PiSirenThin } from "react-icons/pi";
import { MdOutlineTravelExplore } from "react-icons/md";
import { MdOutlineRequestPage } from "react-icons/md";

import { ROLE_ADMIN, ROLE_STAFF } from "./constants";

export interface SliderMenuItem {
  key: string;
  icon: ReactNode;
  label: string;
  roles: string[];
}

export const sliderMenu = [
  {
    key: "dashboard",
    icon: <TbLayoutDashboard />,
    label: "Thống kê",
    roles: [ROLE_STAFF, ROLE_ADMIN],
  },
  {
    key: "account",
    icon: <BiSolidUserAccount />,
    label: "Tài khoản",
    roles: [ROLE_STAFF, ROLE_ADMIN],
  },
  {
    key: "booking",
    icon: <MdOutlineTravelExplore />,
    label: "Chuyến đi",
    roles: [ROLE_STAFF, ROLE_ADMIN],
  },
  {
    key: "emergency",
    icon: <PiSirenThin />,
    label: "Khẩn cấp",
    roles: [ROLE_STAFF, ROLE_ADMIN],
  },
  {
    key: "request",
    icon: <MdOutlineRequestPage />,
    label: "Quản lý yêu cầu",
    roles: [ROLE_ADMIN],
  },
  {
    key: "support",
    icon: <MdOutlineSupportAgent />,
    label: "Hỗ trợ vấn đề",
    roles: [ROLE_STAFF, ROLE_ADMIN],
  },
  {
    key: "configuration",
    icon: <GrDocumentConfig />,
    label: "Cấu hình",
    roles: [ROLE_ADMIN],
  },
] as SliderMenuItem[];
