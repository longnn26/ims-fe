"use client";

import useSelector from "@hooks/use-selector";
import { TableColumnsType, Tag } from "antd";
import { Table } from "antd";
import { useRouter } from "next/router";

interface Props {}

interface DataType {
  key: React.Key;
  id: string;
  name: string;
  rounding: number;
  active: boolean;
  ratio: number;
}

const UomUomTable: React.FC<Props> = (props) => {
  const router = useRouter();
  const { data: uomUomData, loading } = useSelector(
    (state) => state.uomUom
  );

  const columns: TableColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Ratio",
      dataIndex: "ratio",
      key: "ratio",
    },
    {
      title: "Rounding",
      dataIndex: "rounding",
      key: "rounding",
    },
    {
      title: "Active",
      dataIndex: "active",
      key: "active",
    },
    // {
    //   title: "Action",
    //   key: "operation",
    //   render: (record: UomCategory) => (
    //     <Space wrap>
    //       <Tooltip title="Delete" color={"black"}>
    //         <Button onClick={() => {}}>
    //           <AiFillDelete />
    //         </Button>
    //       </Tooltip>
    //     </Space>
    //   ),
    // },
  ];

  const data: DataType[] = [];
  for (let i = 0; i < uomUomData?.length; ++i) {
    data.push({
      key: uomUomData[i].id,
      id: uomUomData[i].id,
      name: uomUomData[i].name,
      ratio: uomUomData[i].ratio,
      rounding: uomUomData[i].rounding,
      active: uomUomData[i].active,
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

export default UomUomTable;
