"use client";

import useSelector from "@hooks/use-selector";
import { Button, message, Popconfirm, Space, TableColumnsType } from "antd";
import { Table } from "antd";
import { useRouter } from "next/router";
import { AiFillDelete } from "react-icons/ai";
// import productTemplateServices from "@services/productTemplate";
import useDispatch from "@hooks/use-dispatch";
import { getStockQuants } from "@slices/stockQuant";
import { StockQuantInfo } from "@models/stockQuant";
import { ProductProduct } from "@models/productProduct";
import { StockLocation } from "@models/stockLocation";
import { FaHistory } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { TbSum } from "react-icons/tb";
import Link from "next/link";

interface Props {
  accessToken: string;
  productTmplId: string;
}

interface DataType {
  key: React.Key;
  id: string;
  productProduct: ProductProduct;
  stockLocation: StockLocation;
  inventoryDate: string;
  quantity: number;
  inventoryQuantity: number;
  inventoryDiffQuantity: number;
  inventoryQuantitySet: boolean;
  uomUom: string;
}

const StockQuantTable: React.FC<Props> = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { accessToken } = props;
  const { data: stockQuantData, loading } = useSelector(
    (state) => state.stockQuant
  );

  const columns: TableColumnsType<DataType> = [
    {
      title: "Product Variant",
      render: (record: DataType) => (
        <>
          <p>{`${record.productProduct.name} (${record.productProduct.pvcs
            .map((pvc) => `${pvc.value}`)
            .join(", ")})`}</p>
        </>
      ),
    },
    {
      title: "Location",
      render: (record: DataType) => (
        <>
          <p>{record.stockLocation?.completeName}</p>
        </>
      ),
    },
    {
      title: "On Hand Quantity",
      align: "center",
      render: (record: DataType) => (
        <Space
          wrap
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Space wrap onClick={(e) => e.stopPropagation()}>
            <p className="font-bold text-[#4a819e]">{record.quantity}</p>
            <Link href={`/inventory-adjustments/${record?.productProduct.id}`}>
              <MdEdit></MdEdit>
            </Link>
          </Space>
        </Space>
      ),
    },
    {
      title: "Unit",
      align: "center",
      render: (record: DataType) => (
        <>
          <p>{record.uomUom}</p>
        </>
      ),
    },
    {
      key: "operation",
      width: "15%",
      render: (record: DataType) => (
        <Space
          wrap
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Space wrap onClick={(e) => e.stopPropagation()}>
            <Link href={`/moves-history/${record.id}`}>
              <FaHistory></FaHistory> History
            </Link>
          </Space>
        </Space>
      ),
    },
  ];
  const data: DataType[] = [];
  for (let i = 0; i < stockQuantData?.length; ++i) {
    data.push({
      key: stockQuantData[i].id,
      id: stockQuantData[i].id,
      productProduct: stockQuantData[i].productProduct,
      stockLocation: stockQuantData[i].stockLocation,
      inventoryDate: stockQuantData[i].inventoryDate,
      quantity: stockQuantData[i].quantity,
      inventoryQuantity: stockQuantData[i].inventoryQuantity,
      inventoryDiffQuantity: stockQuantData[i].inventoryDiffQuantity,
      inventoryQuantitySet: stockQuantData[i].inventoryQuantitySet,
      uomUom: stockQuantData[i].uomUom,
    });
  }

  const totalQuantity = stockQuantData.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );
  return (
    <>
      <Table
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {},
          };
        }}
        loading={loading}
        columns={columns}
        dataSource={data}
        bordered
        pagination={false}
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell index={1} colSpan={2}></Table.Summary.Cell>
              <Table.Summary.Cell index={1} align="center">
                <Space wrap>
                  <p className="font-bold text-[#4a819e]">{totalQuantity}</p>
                  <TbSum />
                </Space>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
    </>
  );
};

export default StockQuantTable;
