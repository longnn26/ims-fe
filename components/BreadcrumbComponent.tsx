"use client";

import { Breadcrumb } from "antd";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";

interface Props {
  itemBreadcrumbs: ItemType[];
}
const BreadcrumbComponent: React.FC<Props> = (props) => {
  const { itemBreadcrumbs } = props;
  itemBreadcrumbs.forEach((element) => {
    switch (element.title) {
      case "server":
        element.title = "Server";
        break;
      case "customer":
        element.title = "Customer";
        break;
      case "requestUpgrade":
        element.title = "Hardware Upgrade Request";
        break;
      case "requestExpand":
        element.title = "Server Allocation Request";
        break;
      case "area":
        element.title = "Area";
        break;
      case "appointment":
        element.title = "Appointment";
        break;
      case "ipSubnet":
        element.title = "IP Subnet";
        break;
      case "requestHost":
        element.title = "IP Request";
        break;
      case "incident":
        element.title = "Incident";
        break;
    }
  });
  return (
    <div className="">
      <Breadcrumb items={itemBreadcrumbs} />
    </div>
  );
};

export default BreadcrumbComponent;
