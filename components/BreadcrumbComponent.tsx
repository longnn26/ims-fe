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
      case "requestUpgrade":
        element.title = "Request upgrade";
        break;
      case "requestExpand":
        element.title = "Request Expand";
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
    }
  });
  return (
    <div className="">
      <Breadcrumb items={itemBreadcrumbs} />
    </div>
  );
};

export default BreadcrumbComponent;
