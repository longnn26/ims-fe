import { ReactNode } from "react";
import { FaUser, FaChartArea } from "react-icons/fa";
import { BiServer, BiSolidComponent } from "react-icons/bi";
import { BsFillHddNetworkFill } from "react-icons/bs";
import { GrHost, GrSchedules } from "react-icons/gr";
import { MdUpgrade } from "react-icons/md";

export interface SliderMenuItem {
  key: string;
  icon: ReactNode;
  label: string;
}

export const sliderMenu = [
  {
    key: "server",
    icon: <BiServer />,
    label: "Server",
  },
  {
    key: "requestUpgrade",
    icon: <MdUpgrade />,
    label: "Request Upgrade",
  },
  {
    key: "requestHost",
    icon: <GrHost />,
    label: "IP's Request",
  },
  {
    key: "ipSubnet",
    icon: <BsFillHddNetworkFill />,
    label: "IP Subnet",
  },
  {
    key: "appointment",
    icon: <GrSchedules />,
    label: "Appointment",
  },
  {
    key: "component",
    icon: <BiSolidComponent />,
    label: "Component",
  },
  {
    key: "customer",
    icon: <FaUser />,
    label: "Customer",
  },
  {
    key: "area",
    icon: <FaChartArea />,
    label: "Area",
  },
  {
    key: "customer-hapn",
    icon: <FaUser />,
    label: "Customer New",
  },
] as SliderMenuItem[];
