"use client";

import useSelector from "@hooks/use-selector";
import {
  Button,
  message,
  Popconfirm,
  Space,
  TableColumnsType,
  Tag,
} from "antd";
import { Table } from "antd";
import { useRouter } from "next/router";
import { AiFillDelete } from "react-icons/ai";
import productCategoryServices from "@services/productCategory";
import useDispatch from "@hooks/use-dispatch";
import { getProductCategories } from "@slices/productCategory";
import moment from "moment";

interface Props {
  accessToken?: string;
}

interface DataType {
  key: React.Key;
  id: string;
  reference: string;
  productProduct: string;
  uomUom: string;
  state: string;
  quantityProductUom: number;
  quantity: number;
  location: string;
  locationDest: string;
  writeDate: string;
}

const StockMoveLineTable: React.FC<Props> = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { accessToken } = props;
  const { data: stockMoveLineData, loading } = useSelector(
    (state) => state.stockMoveLine
  );
  const columns: TableColumnsType<DataType> = [
    {
      title: "Date",
      width: "15%",
      render: (record: DataType) => (
        <p>{moment(record.writeDate).format('YYYY-MM-DD HH:mm:ss')}</p>
      ),
    },
    {
      title: "Reference",
      dataIndex: "reference",
      key: "reference",
    },
    {
      title: "Product Variant",
      dataIndex: "productProduct",
      key: "productProduct",
    },
    {
      title: "From",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "To",
      dataIndex: "locationDest",
      key: "locationDest",
    },
    {
      title: "Quantity",
      render: (record: DataType) => (
        <p
          className={`${
            record.quantity < 0 ? "text-red-500" : "text-green-500"
          }`}
        >
          {record.quantityProductUom}
        </p>
      ),
    },
    {
      title: "Unit",
      dataIndex: "uomUom",
      key: "uomUom",
    },
    {
      title: "Status",
      render: (record: DataType) => (
        <Tag color={`${record.state === "Done" ? "#87d068" : ""}`}>
          {record.state}
        </Tag>
      ),
    },
  ];
  const data: DataType[] = [];
  for (let i = 0; i < stockMoveLineData?.length; ++i) {
    data.push({
      key: stockMoveLineData[i].id,
      id: stockMoveLineData[i].id,
      reference: stockMoveLineData[i].reference,
      productProduct: stockMoveLineData[i].productProduct,
      uomUom: stockMoveLineData[i].uomUom,
      state: stockMoveLineData[i].state,
      quantityProductUom: stockMoveLineData[i].quantityProductUom,
      quantity: stockMoveLineData[i].quantity,
      location: stockMoveLineData[i].location,
      locationDest: stockMoveLineData[i].locationDest,
      writeDate: stockMoveLineData[i].writeDate,
    });
  }
  return (
    <>
      <Table
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              // router.push(`/locations/${record?.id}`);
            },
          };
        }}
        className="custom-table"
        loading={loading}
        columns={columns}
        dataSource={data}
        bordered
        pagination={false}
      />
    </>
  );
};

export default StockMoveLineTable;
