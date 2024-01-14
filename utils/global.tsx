import { ReactNode } from "react";
import { FaUser, FaChartArea } from "react-icons/fa";
import { BiServer, BiSolidComponent } from "react-icons/bi";
import { BsFillHddNetworkFill } from "react-icons/bs";
import { GrHost, GrSchedules } from "react-icons/gr";
import { MdUpgrade } from "react-icons/md";
import { IoInformationOutline } from "react-icons/io5";
import { RiBarChartGroupedFill } from "react-icons/ri";
import {
  ROLE_ADMIN,
  ROLE_CUSTOMER,
  ROLE_MANAGER,
  ROLE_SALES,
  ROLE_TECH,
} from "./constants";

export interface SliderMenuItem {
  key: string;
  icon: ReactNode;
  label: string;
  roles: string[];
}

export const sliderMenu = [
  {
    key: "server",
    icon: <BiServer />,
    label: "Server",
    roles: [ROLE_SALES, ROLE_TECH, ROLE_CUSTOMER, ROLE_MANAGER],
  },
  {
    key: "customer",
    icon: <FaUser />,
    label: "Customer",
    roles: [ROLE_TECH, ROLE_SALES, ROLE_MANAGER],
  },
  {
    key: "area",
    icon: <FaChartArea />,
    label: "Rack map",
    roles: [ROLE_TECH, ROLE_MANAGER],
  },
  {
    key: "requestHost",
    icon: <GrHost />,
    label: "IP Request",
    roles: [ROLE_CUSTOMER, ROLE_SALES, ROLE_TECH, ROLE_MANAGER],
  },
  {
    key: "ipSubnet",
    icon: <BsFillHddNetworkFill />,
    label: "IP Subnet",
    roles: [ROLE_TECH, ROLE_MANAGER],
  },
  {
    key: "appointment",
    icon: <GrSchedules />,
    label: "Appointment",
    roles: [ROLE_SALES, ROLE_TECH, ROLE_CUSTOMER, ROLE_MANAGER],
  },
  {
    key: "requestUpgrade",
    icon: <MdUpgrade />,
    label: "Hardware Upgrade Request",
    roles: [ROLE_SALES, ROLE_TECH, ROLE_CUSTOMER, ROLE_MANAGER],
  },
  {
    key: "staffAccount",
    icon: <FaUser />,
    label: "Staff Account Management",
    roles: [ROLE_ADMIN],
  },
  {
    key: "informationDC",
    icon: <IoInformationOutline />,
    label: "Information DC",
    roles: [ROLE_ADMIN],
  },
  {
    key: "statistic",
    icon: <RiBarChartGroupedFill />,
    label: "Statistic",
    roles: [ROLE_SALES, ROLE_MANAGER],
  },
] as SliderMenuItem[];
