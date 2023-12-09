import { ReactNode } from "react";
import { FaUser, FaChartArea } from "react-icons/fa";
import { BiServer, BiSolidComponent } from "react-icons/bi";
import { BsFillHddNetworkFill } from "react-icons/bs";
import { GrSchedules } from "react-icons/gr";
import { MdUpgrade } from "react-icons/md";

export interface SliderMenuItem {
  key: string;
  icon: ReactNode;
  label: string;
}

export const sliderMenu = [
  {
    key: "customer",
    icon: <FaUser />,
    label: "Customer",
  },
  {
    key: "server",
    icon: <BiServer />,
    label: "Server",
  },
  {
    key: "component",
    icon: <BiSolidComponent />,
    label: "Component",
  },
  {
    key: "area",
    icon: <FaChartArea />,
    label: "Rack map",
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
    key: "requestUpgrade",
    icon: <MdUpgrade />,
    label: "Hardware Upgrade Request",
  },
] as SliderMenuItem[];
