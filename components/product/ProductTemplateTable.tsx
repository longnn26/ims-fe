"use client";

import useSelector from "@hooks/use-selector";
import { Button, message, Popconfirm, Space, TableColumnsType } from "antd";
import { Table } from "antd";
import { useRouter } from "next/router";
import { AiFillDelete } from "react-icons/ai";
import productTemplateServices from "@services/productTemplate";
import useDispatch from "@hooks/use-dispatch";
import { getProductTemplates } from "@slices/productTemplate";

interface Props {
  accessToken: string;
}

interface DataType {
  key: React.Key;
  id: string;
  name: string;
  detailedType: string;
  tracking: string;
  description: string;
  active: boolean;
}

const ProductTemplateTable: React.FC<Props> = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { accessToken } = props;
  const { data: productTemplateData, loading } = useSelector(
    (state) => state.productTemplate
  );
  const deleteProductTemplate = async (record: DataType) => {
    await productTemplateServices
      .deleteProductTemplate(accessToken, record.id)
      .then(() => {
        dispatch(
          getProductTemplates({
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
      title: "Product Name",
      dataIndex: "name",
      key: "name",
    },
    {
      key: "operation",
      width: "15%",
      render: (record: DataType) => (
        <Space wrap onClick={(e) => e.stopPropagation()}>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => {
              deleteProductTemplate(record);
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
  for (let i = 0; i < productTemplateData?.length; ++i) {
    data.push({
      key: productTemplateData[i].id,
      id: productTemplateData[i].id,
      name: productTemplateData[i].name,
      detailedType: productTemplateData[i].detailedType,
      tracking: productTemplateData[i].tracking,
      description: productTemplateData[i].description,
      active: productTemplateData[i].active,
    });
  }
  return (
    <>
      <Table
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              router.push(`/products/${record?.id}`);
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

export default ProductTemplateTable;
