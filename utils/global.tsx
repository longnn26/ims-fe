import { ReactNode } from "react";
import { MenuItem } from "@/types/next-auth-d";
import { getItem } from "./helpers";
import { BiTransfer } from "react-icons/bi";
import { IoBarcode, IoReceipt } from "react-icons/io5";
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
import { BiSolidEditLocation } from "react-icons/bi";
import { MdInventory2, MdWarehouse } from "react-icons/md";
export interface SliderMenuItem {
  key: string;
  icon: ReactNode;
  label: string;
  roles: string[];
  children: ItemType[];
}

// export const sliderMenu = [
//   {
//     key: "receive",
//     icon: <RiFolderReceivedFill />,
//     label: "Receive",
//     // roles: [ROLE_CUSTOMER, ROLE_ADMIN],
//   },
//   {
//     key: "product",
//     icon: <MdInventory />,
//     label: "Product",
//     // roles: [ROLE_CUSTOMER, ROLE_ADMIN],
//   },
//   {
//     key: "dashboard",
//     icon: <AiOutlineDashboard />,
//     label: "Dashboard",
//     // roles: [ROLE_CUSTOMER, ROLE_ADMIN],
//   },
// ] as SliderMenuItem[];

export const sliderMenus: MenuItem[] = [
  getItem("Product", "product", <HiTemplate />, [
    getItem("Products", "products", <></>),
    getItem("Product Variants", "product-variants", <></>),
    getItem("Lots/Serial Numbers", "lots-serial-numbers", <></>),
  ]),
  getItem("Transfers", "transfers", <BiTransfer />, [
    getItem("Receipts", "receipts", <></>),
    getItem("Internal", "internal", <></>),
    getItem("Deliveries", "deliveries", <></>),
  ]),
  getItem("Warehouse", "warehouse", <FaWarehouse />, [
    getItem("Warehouses", "warehouses", <></>),
    getItem("Locations", "locations", <></>),
  ]),
  getItem("Configuration", "configuration", <IoConstructSharp />, [
    getItem("Profile", "profile", <></>),
    getItem("Units of Measure", "units-of-measure", <></>),
    getItem("Product Categories", "product-categories", <></>),
    getItem("Attributes", "attributes", <></>),
  ]),
];
