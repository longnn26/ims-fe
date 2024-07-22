"use client";

import useSelector from "@hooks/use-selector";
import {
  Input,
  TableColumnsType,
  message,
  Button,
  Space,
  Popconfirm,
} from "antd";
import { Table } from "antd";
import useDispatch from "@hooks/use-dispatch";
import productTemplateAttributeLineServices from "@services/productTemplateAttributeLine";
import {
  ProductTemplateAttributeLineCreate,
  ProductTemplateAttributeLineInfo,
} from "@models/productTemplateAttributeLine";
import { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { getProductTemplateAttributeLines } from "@slices/productTemplateAttributeLine";
import { ProductAttribute } from "@models/productAttribute";
interface Props {
  accessToken: string;
  productTmplId: string;
}

interface DataType {
  key: React.Key;
  id: string;
  productTmplId: string;
  attributeId: string;
  productAttribute: ProductAttribute;
}

const ProductTemplateAttributeLineTable: React.FC<Props> = (props) => {
  const dispatch = useDispatch();
  const { accessToken, productTmplId } = props;
  const { data: productTemplateAttributeLineData, loading } = useSelector(
    (state) => state.productTemplateAttributeLine
  );
  const [data, setData] = useState<DataType[]>([]);

  const deleteProductAttributeValue = async (record: DataType) => {
    await productTemplateAttributeLineServices
      .deleteProductTemplateAttributeLine(accessToken, record.id)
      .then(() => {
        dispatch(
          getProductTemplateAttributeLines({
            token: accessToken,
            productTmplId: productTmplId,
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
      key: "attribute",
      fixed: true,
      width: "30%",
      render: (record: DataType) => (
        <>
          <Input
            required
            readOnly
            style={{ cursor: "pointer" }}
            placeholder="Name"
            variant="borderless"
            defaultValue={record.productAttribute.name}
          />
        </>
      ),
    },
    {
      title: "Values",
      key: "values",
      fixed: true,
      render: (record: DataType) => <></>,
    },
    {
      // title: "Action",
      key: "operation",
      width: "15%",
      render: (record: DataType) => (
        <Space wrap>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => deleteProductAttributeValue(record)}
          >
            <AiFillDelete className="cursor-pointer" />
          </Popconfirm>
        </Space>
      ),
    },
  ];
  useEffect(() => {
    if (productTemplateAttributeLineData) {
      const newData: DataType[] = productTemplateAttributeLineData.map(
        (item) => ({
          key: item.id,
          id: item.id,
          productTmplId: item.productTmplId,
          attributeId: item.attributeId,
          productAttribute: item.productAttribute,
        })
      );
      setData(newData);
    }
  }, [productTemplateAttributeLineData]);

  return (
    <>
      <Table
        loading={loading}
        columns={columns}
        dataSource={data}
        bordered
        pagination={false}
      />
    </>
  );
};

export default ProductTemplateAttributeLineTable;
