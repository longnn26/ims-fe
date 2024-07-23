"use client";

import useSelector from "@hooks/use-selector";
import {
  Input,
  TableColumnsType,
  message,
  Button,
  Space,
  Popconfirm,
  Tag,
  Select,
} from "antd";
import { Table } from "antd";
import useDispatch from "@hooks/use-dispatch";
import productTemplateAttributeLineServices from "@services/productTemplateAttributeLine";
import {
  ProductTemplateAttributeLineCreate,
  ProductTemplateAttributeLineInfo,
  ProductTemplateAttributeValue,
  ProductTemplateAttributeValuesUpdate,
} from "@models/productTemplateAttributeLine";
import { FocusEventHandler, useEffect, useRef, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { getProductTemplateAttributeLines } from "@slices/productTemplateAttributeLine";
import { ProductAttribute } from "@models/productAttribute";

const { Option } = Select;

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
  productTemplateAttributeValues: ProductTemplateAttributeValue[];
}

const ProductTemplateAttributeLineTable: React.FC<Props> = (props) => {
  const dispatch = useDispatch();
  const { accessToken, productTmplId } = props;
  const { data: productTemplateAttributeLineData, loading } = useSelector(
    (state) => state.productTemplateAttributeLine
  );
  const [data, setData] = useState<DataType[]>([]);
  const selectedPtavsRef = useRef<string[]>([]);

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

  const handleChange = (value: string[]) => {
    selectedPtavsRef.current = value;
  };

  const handleBlur = async (attributeLineId: string) => {
    await productTemplateAttributeLineServices
      .updateProductTemplateAttributeValues(accessToken, {
        attributeLineId: attributeLineId,
        productAttributeValueIds: selectedPtavsRef.current,
      } as ProductTemplateAttributeValuesUpdate)
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
      key: "productAttributeValues",
      dataIndex: "productAttributeValues",
      render: (_, { productTemplateAttributeValues, productAttribute, id }) => (
        <>
          <>
            <Select
              style={{ width: "100%" }}
              variant="borderless"
              className="custom-select"
              mode="multiple"
              showSearch={false}
              defaultValue={productTemplateAttributeValues.map(
                (value) => value.productAttributeValue.id
              )}
              onChange={handleChange}
              onBlur={() => handleBlur(id)}
            >
              {productAttribute.productAttributeValues.map((option) => (
                <Option key={option.id} value={option.id}>
                  {option.name}
                </Option>
              ))}
            </Select>
          </>
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
          productTemplateAttributeValues: item.productTemplateAttributeValues,
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
