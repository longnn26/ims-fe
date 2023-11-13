import { ReactNode } from "react";
import { GrNotes, GrLanguage } from "react-icons/gr";
import { MdCategory } from "react-icons/md";
import { BiServer } from "react-icons/bi";

export interface SliderMenuItem {
  key: string;
  icon: ReactNode;
  label: string;
}

export const sliderMenu = [
  {
    key: "server-allocation",
    icon: <BiServer />,
    label: "Server Allocation",
  },
  {
    key: "ticket",
    icon: <GrNotes />,
    label: "Ticket",
  },
  {
    key: "inspect-contract",
    icon: <GrLanguage />,
    label: "Inspect contracts",
  },
  {
    key: "my-account",
    icon: <MdCategory />,
    label: "My Account",
  },
] as SliderMenuItem[];
