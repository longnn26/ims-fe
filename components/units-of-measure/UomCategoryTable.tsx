"use client";

import useSelector from "@hooks/use-selector";
import { TableColumnsType, Tag } from "antd";
import { Table } from "antd";
import { useRouter } from "next/router";
import { UomUom } from "@models/uomUom";

interface Props {}

interface DataType {
  key: React.Key;
  id: string;
  name: string;
  uomUoms: UomUom[];
}

const UomCategoryTable: React.FC<Props> = (props) => {
  const router = useRouter();
  // onClick={() => router.push(`/posts/${bestArticleInfo?.slug}`)}

  const { data: uomCategoryData, loading } = useSelector(
    (state) => state.uomCategory
  );

  const columns: TableColumnsType<DataType> = [
    {
      title: "Units of Measure Category",
      dataIndex: "name",
      key: "name",
      width: "30%",
    },
    {
      title: "Uom",
      key: "uomUoms",
      dataIndex: "tags",
      render: (_, { uomUoms }) => (
        <>
          {uomUoms?.map((uomUom) => {
            let color = uomUom.uomType === "Reference" ? "#88e1da" : "#e6dedd";
            return (
              <Tag style={{ color: "black" }} color={color} key={uomUom.id}>
                {uomUom.name}
              </Tag>
            );
          })}
        </>
      ),
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
  for (let i = 0; i < uomCategoryData?.length; ++i) {
    data.push({
      key: uomCategoryData[i].id,
      id: uomCategoryData[i].id,
      name: uomCategoryData[i].name,
      uomUoms: uomCategoryData[i].uomUoms,
    });
  }

  return (
    <>
      <Table
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              router.push(`/units-of-measure/${record?.id}`);
            },
          };
        }}
        className="custom-table"
        loading={loading}
        columns={columns}
        dataSource={data}
        scroll={{ x: 1300 }}
        pagination={false}
      />
    </>
  );
};

export default UomCategoryTable;
