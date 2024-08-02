"use client";

import useSelector from "@hooks/use-selector";
import { Button, message, Popconfirm, Space, TableColumnsType } from "antd";
import { Table } from "antd";
import { useRouter } from "next/router";
import { AiFillDelete } from "react-icons/ai";
import stockLocationServices from "@services/stockLocation";
import useDispatch from "@hooks/use-dispatch";
import { getProductCategories } from "@slices/productCategory";
import { getStockLocations } from "@slices/stockLocation";

interface Props {
  accessToken: string;
}

interface DataType {
  key: React.Key;
  id: string;
  name: string;
  completeName: string;
  usage: string;
}

const StockLocationTable: React.FC<Props> = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { accessToken } = props;
  const { data: stockLocationData, loading } = useSelector(
    (state) => state.stockLocation
  );
  const deleteStockLocation = async (record: DataType) => {
    await stockLocationServices
      .deleteStockLocation(accessToken, record.id)
      .then(() => {
        dispatch(
          getStockLocations({
            token: accessToken,
          })
        );
      })
      .catch((error) => {
        message.error(error?.response?.data);
      });
  };
  const columns: TableColumnsType<DataType> = [
    {
      title: "Location",
      render: (record: DataType) => (
        <span
          className={`${
            record.usage === "Internal" ? "text-[#d23f3a]" : "text-[#578699]"
          }  `}
        >
          {record.completeName}
        </span>
      ),
    },
    {
      title: "Location Type",
      render: (record: DataType) => (
        <span
          className={`${
            record.usage === "Internal" ? "text-[#d23f3a]" : "text-[#578699]"
          }  `}
        >
          {record.usage}
        </span>
      ),
    },
    {
      key: "operation",
      width: "15%",
      render: (record: DataType) => (
        <Space wrap onClick={(e) => e.stopPropagation()}>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => {
              deleteStockLocation(record);
            }}
          >
            <AiFillDelete className="cursor-pointer" />
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const data: DataType[] = [];
  for (let i = 0; i < stockLocationData?.length; ++i) {
    data.push({
      key: stockLocationData[i].id,
      id: stockLocationData[i].id,
      name: stockLocationData[i].name,
      completeName: stockLocationData[i].completeName,
      usage: stockLocationData[i].usage,
    });
  }
  return (
    <>
      <Table
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              router.push(`/locations/${record?.id}`);
            },
          };
        }}
        className="custom-table"
        loading={loading}
        columns={columns}
        dataSource={data}
        bordered
        // scroll={{ x: 1300 }}
        pagination={false}
      />
    </>
  );
};

export default StockLocationTable;
