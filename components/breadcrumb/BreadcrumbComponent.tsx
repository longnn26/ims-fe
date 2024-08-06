import { Breadcrumb } from "antd";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { useEffect, useState } from "react";
import productTemplateServices from "@services/productTemplate";
import stockWarehouseServices from "@services/stockWarehouse";

interface Props {
  accessToken?: string;
  itemBreadcrumbs: ItemType[];
}
const BreadcrumbComponent: React.FC<Props> = (props) => {
  const { accessToken, itemBreadcrumbs } = props;
  const [updatedBreadcrumbs, setUpdatedBreadcrumbs] = useState(itemBreadcrumbs);

  useEffect(() => {
    const fetchTitle = async (href) => {
      if (href.startsWith("/products/")) {
        const productId = href.split("/")[2];
        try {
          const response = await productTemplateServices.getProductTemplateInfo(
            accessToken,
            productId
          );
          return response.name;
        } catch (error) {
          console.error("Failed to fetch product name:", error);
          return productId;
        }
      }
      if (href.startsWith("/overview/")) {
        const index = href.split("/").length - 1;
        if (href.split("/")[index] == href.split("/")[2]) {
          const warehouseId = href.split("/")[2];
          try {
            const response = await stockWarehouseServices.getStockWarehouseInfo(
              accessToken,
              warehouseId
            );
            return response.name;
          } catch (error) {
            console.error("Failed to fetch  name:", error);
            return warehouseId;
          }
        }
      }
      return null;
    };

    const updateBreadcrumbs = async () => {
      const promises = updatedBreadcrumbs.map(async (breadcrumb) => {
        const title = await fetchTitle(breadcrumb.href);
        return title ? { ...breadcrumb, title } : breadcrumb;
      });
      const resolvedBreadcrumbs = await Promise.all(promises);
      setUpdatedBreadcrumbs(resolvedBreadcrumbs);
    };

    updateBreadcrumbs();
  }, [itemBreadcrumbs]);
  return (
    <div className="">
      <Breadcrumb items={updatedBreadcrumbs} />
    </div>
  );
};

export default BreadcrumbComponent;
