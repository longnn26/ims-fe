import { ReactNode } from "react";
import { RiFolderReceivedFill } from "react-icons/ri";
import { MdInventory } from "react-icons/md";
import { AiOutlineDashboard } from "react-icons/ai";


import {
  ROLE_ADMIN,
  ROLE_CUSTOMER,
} from "./constants";

export interface SliderMenuItem {
  key: string;
  icon: ReactNode;
  label: string;
  roles: string[];
}

export const sliderMenu = [
  {
    key: "receive",
    icon: <RiFolderReceivedFill />,
    label: "Receive",
    roles: [ROLE_CUSTOMER, ROLE_ADMIN],
  },
  {
    key: "product",
    icon: <MdInventory />,
    label: "Product",
    roles: [ROLE_CUSTOMER, ROLE_ADMIN],
  },
  {
    key: "dashboard",
    icon: <AiOutlineDashboard />,
    label: "Dashboard",
    roles: [ROLE_CUSTOMER, ROLE_ADMIN],
  },
] as SliderMenuItem[];
