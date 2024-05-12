import { ReactNode } from "react";
import { AiFillSchedule } from "react-icons/ai";
import { BiSolidUserAccount } from "react-icons/bi";
import { MdOutlineSupportAgent } from "react-icons/md";

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
    key: "booking",
    icon: <AiFillSchedule />,
    label: "Booking",

    roles: [ROLE_CUSTOMER],
  },
  {
    key: "account",
    icon: <BiSolidUserAccount />,
    label: "Account",
    roles: [ROLE_CUSTOMER],
  },
  {
    key: "support",
    icon: <MdOutlineSupportAgent />,
    label: "Support",
    roles: [ROLE_CUSTOMER, ROLE_ADMIN],
  },
] as SliderMenuItem[];
