import { ReactNode } from "react";
import { FaUser, FaChartArea } from "react-icons/fa";
import { BiServer, BiSolidComponent } from "react-icons/bi";
import { BsFillHddNetworkFill } from "react-icons/bs";
import { GrHost, GrSchedules } from "react-icons/gr";
import { MdUpgrade } from "react-icons/md";
import { IoInformationOutline } from "react-icons/io5";
import { ROLE_ADMIN, ROLE_CUSTOMER, ROLE_SALES, ROLE_TECH } from "./constants";

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
    roles: [ROLE_SALES, ROLE_TECH, ROLE_CUSTOMER],
  },
  {
    key: "customer",
    icon: <FaUser />,
    label: "Customer",
    roles: [ROLE_TECH, ROLE_SALES],
  },
  {
    key: "component",
    icon: <BiSolidComponent />,
    label: "Component",
    roles: [ROLE_TECH],
  },
  {
    key: "area",
    icon: <FaChartArea />,
    label: "Rack map",
    roles: [ROLE_TECH],
  },
  {
    key: "requestHost",
    icon: <GrHost />,
    label: "IP Request",
    roles: [ROLE_CUSTOMER, ROLE_SALES, ROLE_TECH],
  },
  {
    key: "ipSubnet",
    icon: <BsFillHddNetworkFill />,
    label: "IP Subnet",
    roles: [ROLE_TECH],
  },
  {
    key: "appointment",
    icon: <GrSchedules />,
    label: "Appointment",
    roles: [ROLE_SALES, ROLE_TECH, ROLE_CUSTOMER],
  },
  {
    key: "requestUpgrade",
    icon: <MdUpgrade />,
    label: "Hardware Upgrade Request",
    roles: [ROLE_SALES, ROLE_TECH, ROLE_CUSTOMER],
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
] as SliderMenuItem[];
