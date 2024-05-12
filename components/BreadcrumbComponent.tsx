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
      case "receive":
        element.title = "Receive";
        break;
      case "product":
        element.title = "product";
        break;
      case "dashboard":
        element.title = "dashboard";
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
