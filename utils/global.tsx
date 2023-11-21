import { ReactNode } from "react";
import { FaUser, FaChartArea } from "react-icons/fa";
import { BiServer, BiSolidComponent } from "react-icons/bi";
import { GoGitPullRequest } from "react-icons/go";

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
    icon: <GoGitPullRequest />,
    label: "Request Upgrade",
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
] as SliderMenuItem[];
