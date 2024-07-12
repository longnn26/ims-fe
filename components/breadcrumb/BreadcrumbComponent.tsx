import { Breadcrumb } from "antd";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";

interface Props {
  itemBreadcrumbs: ItemType[];
}
const BreadcrumbComponent: React.FC<Props> = (props) => {
  const { itemBreadcrumbs } = props;
  return (
    <div className="">
      <Breadcrumb items={itemBreadcrumbs} />
    </div>
  );
};

export default BreadcrumbComponent;
