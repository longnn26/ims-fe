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
import productTemplateServices from "@services/productTemplate";
import useDispatch from "@hooks/use-dispatch";
import { getProductTemplates } from "@slices/productTemplate";
import { ProductCategory } from "@models/productCategory";
import { UomUom } from "@models/uomUom";

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
  productCategory: ProductCategory;
  uomUom: UomUom;
  totalVariant: number;
  qtyAvailable: number;
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
      title: "Variants",
      render: (record: DataType) => (
        <>
          <p className="font-bold">{record.totalVariant}</p>
        </>
      ),
    },
    {
      title: "On Hand",
      render: (record: DataType) => (
        <>
          <p className="font-bold text-[#4a819e]">{record.qtyAvailable}</p>
        </>
      ),
    },
    {
      title: "Unit",
      key: "uomUom",
      render: (record: DataType) => (
        <>
          <p>{record.uomUom.name}</p>
        </>
      ),
    },
    {
      title: "Product Category",
      key: "productCategory",
      fixed: true,
      render: (record: DataType) => (
        <>
          <p>{record.productCategory.name}</p>
        </>
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
              deleteProductTemplate(record);
            }}
          >
            <AiFillDelete className="cursor-pointer" />
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
      productCategory: productTemplateData[i].productCategory,
      uomUom: productTemplateData[i].uomUom,
      totalVariant: productTemplateData[i].totalVariant,
      qtyAvailable: productTemplateData[i].qtyAvailable,
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
