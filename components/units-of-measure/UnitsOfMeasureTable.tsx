"use client";

import useSelector from "@hooks/use-selector";
import { TableColumnsType } from "antd";
import { Button, Space, Table, Tooltip } from "antd";
import { AiFillDelete } from "react-icons/ai";
import { UomCategory } from "@models/uomCategory";
import { useRouter } from "next/router";

interface Props {}

interface DataType {
  key: React.Key;
  id: string;
  name: string;
}

const UnitsOfMeasureTable: React.FC<Props> = (props) => {
  const router = useRouter();
  const { uomCategoryData, loading } = useSelector(
    (state) => state.uomCategory
  );

  const columns: TableColumnsType<DataType> = [
    {
      title: "No",
      dataIndex: "id",
      key: "id",
      fixed: "left",
    },
    { title: "Units of Measure Category", dataIndex: "name", key: "name" },
    {
      title: "Action",
      key: "operation",
      render: (record: UomCategory) => (
        <Space wrap>
          <Tooltip title="Delete" color={"black"}>
            <Button onClick={() => {}}>
              <AiFillDelete />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const data: DataType[] = [];
  for (let i = 0; i < uomCategoryData?.data?.length; ++i) {
    data.push({
      key: uomCategoryData?.data[i].id,
      id: uomCategoryData?.data[i].id,
      name: uomCategoryData?.data[i].name,
    });
  }

  return (
    <>
      <Table
        loading={loading}
        columns={columns}
        dataSource={data}
        scroll={{ x: 1300 }}
        pagination={false}
      />
    </>
  );
};

export default UnitsOfMeasureTable;
