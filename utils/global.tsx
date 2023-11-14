import { ReactNode } from "react";
import { GrNotes, GrLanguage } from "react-icons/gr";
import { MdCategory } from "react-icons/md";
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
] as SliderMenuItem[];
