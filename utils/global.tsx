import { ReactNode } from "react";
import { RiFolderReceivedFill } from "react-icons/ri";
import { MdInventory } from "react-icons/md";
import { AiOutlineDashboard } from "react-icons/ai";

import { MenuItem } from "@/types/next-auth-d";
import { getItem } from "./helpers";

import { MdOutlineInventory2, MdInventory2 } from "react-icons/md";
import { IoBarcode } from "react-icons/io5";
import { BiTransfer } from "react-icons/bi";
import { IoReceipt } from "react-icons/io5";
import { TbTruckDelivery } from "react-icons/tb";
import { GrDocumentTransfer } from "react-icons/gr";
import { FaWarehouse } from "react-icons/fa6";
import { ImProfile } from "react-icons/im";
import { RiFolderSettingsFill } from "react-icons/ri";
import { TbRulerMeasure } from "react-icons/tb";
import { IoConstructSharp } from "react-icons/io5";
import { ItemType } from "antd/es/menu/interface";
import { BiSolidCategory } from "react-icons/bi";
import { BiSolidTagAlt } from "react-icons/bi";
import { HiTemplate } from "react-icons/hi";

export interface SliderMenuItem {
  key: string;
  icon: ReactNode;
  label: string;
  roles: string[];
  children: ItemType[];
}

export const sliderMenu = [
  {
    key: "receive",
    icon: <RiFolderReceivedFill />,
    label: "Receive",
    // roles: [ROLE_CUSTOMER, ROLE_ADMIN],
  },
  {
    key: "product",
    icon: <MdInventory />,
    label: "Product",
    // roles: [ROLE_CUSTOMER, ROLE_ADMIN],
  },
  {
    key: "dashboard",
    icon: <AiOutlineDashboard />,
    label: "Dashboard",
    // roles: [ROLE_CUSTOMER, ROLE_ADMIN],
  },
] as SliderMenuItem[];

export const sliderMenus: MenuItem[] = [
  getItem("Product", "product", <RiFolderSettingsFill />, [
    getItem("Products", "products", <HiTemplate />),
    getItem("Product Variants", "product-variants", <MdInventory2 />),
    getItem("Lots/Serial Numbers", "lots-serial-numbers", <IoBarcode />),
  ]),
  getItem("Transfers", "transfers", <BiTransfer />, [
    getItem("Receipts", "receipts", <IoReceipt />),
    getItem("Internal", "internal", <GrDocumentTransfer />),
    getItem("Deliveries", "deliveries", <TbTruckDelivery />),
  ]),
  getItem("Warehouses", "warehouses", <FaWarehouse />),
  getItem("Configuration", "configuration", <IoConstructSharp />, [
    getItem("Profile", "profile", <ImProfile />),
    getItem("Units of Measure", "units-of-measure", <TbRulerMeasure />),
    getItem("Product Categories", "product-categories", <BiSolidCategory />),
    getItem("Attributes", "attributes", <BiSolidTagAlt />),
  ]),
];
