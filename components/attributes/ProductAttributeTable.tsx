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
import { ProductAttributeValue } from "@models/productAttributeValue";
import { AiFillDelete } from "react-icons/ai";
import productAttributeServices from "@services/productAttribute";
import useDispatch from "@hooks/use-dispatch";
import { getProductAttributes } from "@slices/productAttribute";

interface Props {
  accessToken: string;
}

interface DataType {
  key: React.Key;
  id: string;
  name: string;
  productAttributeValues: ProductAttributeValue[];
}

const ProductAttributeTable: React.FC<Props> = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { accessToken } = props;
  const { data: productAttributeData, loading } = useSelector(
    (state) => state.productAttribute
  );
  const deleteProductAttribute = async (record: DataType) => {
    await productAttributeServices
      .deleteProductAttribute(accessToken, record.id)
      .then(() => {
        dispatch(
          getProductAttributes({
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
      title: "Attribute",
      dataIndex: "name",
      key: "name",
      width: "30%",
    },
    {
      title: "Attribute Values",
      key: "productAttributeValues",
      dataIndex: "productAttributeValues",
      render: (_, { productAttributeValues }) => (
        <>
          {productAttributeValues?.map((pt) => {
            // let color = uomUom.uomType === "Reference" ? "#88e1da" : "#e6dedd";
            return (
              <Tag style={{ color: "black" }} key={pt.id}>
                {pt.name}
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
        <Space wrap onClick={(e) => e.stopPropagation()}>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => {
              deleteProductAttribute(record);
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
  for (let i = 0; i < productAttributeData?.length; ++i) {
    data.push({
      key: productAttributeData[i].id,
      id: productAttributeData[i].id,
      name: productAttributeData[i].name,
      productAttributeValues: productAttributeData[i].productAttributeValues,
    });
  }
  return (
    <>
      <Table
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              router.push(`/attributes/${record?.id}`);
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

export default ProductAttributeTable;
