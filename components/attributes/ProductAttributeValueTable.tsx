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
import { PlusOutlined } from "@ant-design/icons";
import useDispatch from "@hooks/use-dispatch";
import productAttributeValueServices from "@services/productAttributeValue";
import {
  ProductAttributeValueCreate,
  ProductAttributeValueInfo,
  ProductAttributeValueUpdate,
} from "@models/productAttributeValue";
import { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { getProductAttributeValues } from "@slices/productAttributeValue";
interface Props {
  accessToken: string;
  attributeId: string;
}

interface DataType {
  key: React.Key;
  id: string;
  name: string;
  attributeId: string;
}

const ProductAttributeValueTable: React.FC<Props> = (props) => {
  const dispatch = useDispatch();
  const { accessToken, attributeId } = props;
  const { data: productAttributeValueData, loading } = useSelector(
    (state) => state.productAttributeValue
  );
  const [data, setData] = useState<DataType[]>([]);

  const updateProductAttributeValue = async (
    data: ProductAttributeValueUpdate
  ) => {
    await productAttributeValueServices
      .updateProductAttributeValue(accessToken, data)
      .then(() => {
        dispatch(
          getProductAttributeValues({
            token: accessToken,
            attributeId: attributeId,
          })
        );
      })
      .catch((error) => {
        message.error(error?.response?.data);
      });
  };
  const handleBlur = async (
    event: React.FocusEvent<HTMLInputElement>,
    type: string,
    record: DataType
  ) => {
    const newValue = event.target.value;
    switch (type) {
      case "name":
        if (newValue !== record.name) {
          await updateProductAttributeValue({
            id: record.id,
            name: newValue,
          } as ProductAttributeValueInfo);
        }
        break;
      default:
        break;
    }
  };
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: React.Key,
    field: string
  ) => {
    const newData = data.map((item) => {
      if (item.key === key) {
        return { ...item, [field]: event.target.value };
      }
      return item;
    });
    setData(newData);
  };
  
  const createProductAttributeValue = async () => {
    await productAttributeValueServices
      .createProductAttributeValue(accessToken, {
        attributeId: attributeId,
      } as ProductAttributeValueCreate)
      .then(() => {
        dispatch(
          getProductAttributeValues({
            token: accessToken,
            attributeId: attributeId,
          })
        );
      })
      .catch((error) => {
        message.error(error?.response?.data);
      });
  };
  const deleteProductAttributeValue = async (record: DataType) => {
    await productAttributeValueServices
      .deleteProductAttributeValue(accessToken, record.id)
      .then(() => {
        dispatch(
          getProductAttributeValues({
            token: accessToken,
            attributeId: attributeId,
          })
        );
      })
      .catch((error) => {
        message.error(error?.response?.data);
      });
  };
  const columns: TableColumnsType<DataType> = [
    {
      title: "Value",
      key: "name",
      fixed: true,
      render: (record: DataType) => (
        <>
          <Input
            required
            style={{ cursor: "pointer" }}
            placeholder="Name"
            variant="borderless"
            defaultValue={record.name}
            onBlur={(event) => {
              handleBlur(event, "name", record);
            }}
          />
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
    if (productAttributeValueData) {
      const newData: DataType[] = productAttributeValueData.map((item) => ({
        key: item.id,
        id: item.id,
        name: item.name,
        attributeId: item.attributeId,
      }));
      setData(newData);
    }
  }, [productAttributeValueData]);

  return (
    <>
      <Table
        loading={loading}
        columns={columns}
        dataSource={data}
        bordered
        // scroll={{ x: 1300 }}
        pagination={false}
      />
      <Button
        type="dashed"
        onClick={createProductAttributeValue}
        style={{ width: "100%", marginTop: "20px" }}
        icon={<PlusOutlined />}
      >
        Add line
      </Button>
    </>
  );
};

export default ProductAttributeValueTable;
