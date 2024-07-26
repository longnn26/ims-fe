"use client";

import useSelector from "@hooks/use-selector";
import { Button, message, Popconfirm, Space, TableColumnsType } from "antd";
import { Table } from "antd";
import { useRouter } from "next/router";
import { AiFillDelete } from "react-icons/ai";
import stockWarehouseServices from "@services/stockWarehouse";
import useDispatch from "@hooks/use-dispatch";
import { getStockWarehouses } from "@slices/stockWarehouse";

interface Props {
  accessToken: string;
}

interface DataType {
  key: React.Key;
  id: string;
  name: string;
  code: string;
}

const StockWarehouseTable: React.FC<Props> = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { accessToken } = props;
  const { data: stockWarehouseData, loading } = useSelector(
    (state) => state.stockWarehouse
  );
  const deleteStockWarehouse = async (record: DataType) => {
    await stockWarehouseServices
      .deleteStockWarehouse(accessToken, record.id)
      .then(() => {
        dispatch(
          getStockWarehouses({
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
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Code",
      key: "code",
      dataIndex: "code",
    },
    {
      key: "operation",
      width: "15%",
      render: (record: DataType) => (
        <Space wrap onClick={(e) => e.stopPropagation()}>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => {
              deleteStockWarehouse(record);
            }}
          >
            <Button>
              <AiFillDelete />
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const data: DataType[] = [];
  for (let i = 0; i < stockWarehouseData?.length; ++i) {
    data.push({
      key: stockWarehouseData[i].id,
      id: stockWarehouseData[i].id,
      name: stockWarehouseData[i].name,
      code: stockWarehouseData[i].code,
    });
  }
  return (
    <>
      <Table
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              router.push(`/warehouse/${record?.id}`);
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

export default StockWarehouseTable;
