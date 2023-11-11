import { ReactNode } from "react";
import { GrNotes, GrLanguage } from "react-icons/gr";
import { FaHome } from "react-icons/fa";
import { MdCategory } from "react-icons/md";

export interface SliderMenuItem {
  key: string;
  icon: ReactNode;
  label: string;
}

export const sliderMenu = [
  {
    key: "customer",
    icon: <FaHome />,
    label: "Customer",
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
