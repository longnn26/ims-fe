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
      case "area":
        element.title = "Area";
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