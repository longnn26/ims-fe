"use client";

import useSelector from "@hooks/use-selector";
import { message, Popconfirm, Space, TableColumnsType, Tag } from "antd";
import { Table } from "antd";
import { useRouter } from "next/router";
import { UomUom } from "@models/uomUom";
import { AiFillDelete } from "react-icons/ai";
import uomCategoryServices from "@services/uomCategory";
import useDispatch from "@hooks/use-dispatch";
import { getUomCategories } from "@slices/uomCategory";

interface Props {
  accessToken: string;
}

interface DataType {
  key: React.Key;
  id: string;
  name: string;
  uomUoms: UomUom[];
}

const UomCategoryTable: React.FC<Props> = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { accessToken } = props;
  const { data: uomCategoryData, loading } = useSelector(
    (state) => state.uomCategory
  );
  const deleteUomCategory = async (record: DataType) => {
    await uomCategoryServices
      .deleteUomCategory(accessToken, record.id)
      .then(() => {
        // dispatch(
        //   getUomCategories({
        //     token: accessToken,
        //   })
        // );
      })
      .catch((error) => {
        message.error(error?.response?.data);
      });
  };
  const columns: TableColumnsType<DataType> = [
    {
      title: "Unit of Measure Category",
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
    {
      // title: "Action",
      key: "operation",
      width: "15%",
      render: (record: DataType) => (
        <Space wrap>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => deleteUomCategory(record)}
          >
            <AiFillDelete className="cursor-pointer" />
          </Popconfirm>
        </Space>
      ),
    },
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
        bordered
        // scroll={{ x: 1300 }}
        pagination={false}
      />
    </>
  );
};

export default UomCategoryTable;
