import { ReactNode } from "react";
import { FaUser } from "react-icons/fa";
import { BiServer, BiSolidComponent } from "react-icons/bi";

export interface SliderMenuItem {
  key: string;
  icon: ReactNode;
  label: string;
}

export const sliderMenu = [
  {
    key: "server",
    icon: <BiServer />,
    label: "Server Allocation",
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
] as SliderMenuItem[];
