"use client";

import useSelector from "@hooks/use-selector";
import {
  Button,
  Input,
  message,
  Popconfirm,
  Space,
  TableColumnsType,
} from "antd";
import { Table } from "antd";
import { useRouter } from "next/router";
import { AiFillDelete } from "react-icons/ai";
import stockQuantServices from "@services/stockQuant";
import useDispatch from "@hooks/use-dispatch";
import { ProductProduct } from "@models/productProduct";
import { StockLocation } from "@models/stockLocation";
import { FaHistory } from "react-icons/fa";
import { MdOutlineAdjust } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { FaSave } from "react-icons/fa";
import { MdClear } from "react-icons/md";
import Link from "next/link";
import { StockQuantUpdate } from "@models/stockQuant";
import { getStockQuants } from "@slices/stockQuantProduct";
import { useEffect, useState } from "react";

interface Props {
  accessToken: string;
  productVariantId: string;
}

interface DataType {
  key: React.Key;
  id: string;
  productProduct: ProductProduct;
  stockLocation: StockLocation;
  inventoryDate: string;
  quantity: number;
  inventoryQuantity: number;
  inventoryDiffQuantity: number;
  inventoryQuantitySet: boolean;
  uomUom: string;
}

const StockQuantProductTable: React.FC<Props> = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { accessToken } = props;
  const { data: stockQuantData, loading } = useSelector(
    (state) => state.stockQuantProduct
  );
  const [data, setData] = useState<DataType[]>([]);
  const [countedQuantity, setCountedQuantity] = useState<{
    [key: string]: number;
  }>({});
  const handleBlurInventoryQuantity = async (
    event: React.FocusEvent<HTMLInputElement>,
    record: DataType
  ) => {
    const newValue = event.target.value;
    if (newValue && Number.parseFloat(newValue) !== record.inventoryQuantity) {
      await stockQuantServices
        .updateStockQuant(accessToken, {
          id: record.id,
          inventoryQuantity: Number.parseFloat(newValue),
        } as StockQuantUpdate)
        .then(() => {
          dispatch(
            getStockQuants({
              token: accessToken,
              productVariantId: record.productProduct.id,
            })
          );
        })
        .catch((error) => {
          message.error(error?.response?.data);
        });
    }
  };

  const setStockQuant = async (record: DataType) => {
    await stockQuantServices
      .setStockQuant(accessToken, record.id)
      .then(() => {
        dispatch(
          getStockQuants({
            token: accessToken,
            productVariantId: record.productProduct.id,
          })
        );
      })
      .catch((error) => {
        message.error(error?.response?.data);
      });
  };

  const clearStockQuant = async (record: DataType) => {
    await stockQuantServices
      .clearStockQuant(accessToken, record.id)
      .then(() => {
        dispatch(
          getStockQuants({
            token: accessToken,
            productVariantId: record.productProduct.id,
          })
        );
      })
      .catch((error) => {
        message.error(error?.response?.data);
      });
  };

  const applyStockQuant = async (record: DataType) => {
    await stockQuantServices
      .applyStockQuant(accessToken, record.id)
      .then(() => {
        dispatch(
          getStockQuants({
            token: accessToken,
            productVariantId: record.productProduct.id,
          })
        );
      })
      .catch((error) => {
        message.error(error?.response?.data);
      });
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: "Product Variant",
      render: (record: DataType) => (
        <>
          <p>{`${record.productProduct.name} (${record.productProduct.pvcs
            .map((pvc) => `${pvc.value}`)
            .join(", ")})`}</p>
        </>
      ),
    },
    {
      title: "Location",
      render: (record: DataType) => (
        <>
          <p>{record.stockLocation?.completeName}</p>
        </>
      ),
    },
    {
      title: "On Hand Quantity",
      align: "center",
      render: (record: DataType) => (
        <>
          <p className="font-bold">{record.quantity}</p>
        </>
      ),
    },
    {
      title: "Counted Quantity",
      render: (record: DataType) => (
        <>
          <Input
            required
            type="number"
            style={{ cursor: "pointer" }}
            placeholder="0"
            variant="filled"
            value={countedQuantity![record.id]}
            onChange={(event) => {
              setCountedQuantity({
                ...countedQuantity,
                [record.id]: Number.parseFloat(event.target.value),
              });
            }}
            onBlur={(event) => {
              handleBlurInventoryQuantity(event, record);
            }}
          />
        </>
      ),
    },
    {
      title: "Difference",
      align: "center",
      render: (record: DataType) => (
        <>
          <p
            className={`${
              record.inventoryDiffQuantity <= 0
                ? "text-red-500"
                : "text-green-500"
            } font-bold`}
          >
            {record.inventoryDiffQuantity}
          </p>
        </>
      ),
    },
    {
      key: "operation",
      // width: "15%",
      render: (record: DataType) => (
        <Space
          wrap
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Space wrap onClick={(e) => e.stopPropagation()}>
            <Link href={`/moves-history/${record.id}`}>
              <FaHistory></FaHistory> History
            </Link>
          </Space>
          {record.inventoryQuantitySet && (
            <>
              <Space wrap onClick={(e) => e.stopPropagation()}>
                <Popconfirm
                  title="Sure to apply?"
                  onConfirm={() => {
                    applyStockQuant(record);
                  }}
                >
                  <FaSave className="cursor-pointer" /> Apply
                </Popconfirm>
              </Space>
              <Space wrap onClick={(e) => e.stopPropagation()}>
                <Popconfirm
                  title="Sure to clear?"
                  onConfirm={() => {
                    clearStockQuant(record);
                  }}
                >
                  <MdClear className="cursor-pointer" /> Clear
                </Popconfirm>
              </Space>
            </>
          )}
          {!record.inventoryQuantitySet && (
            <>
              <Space wrap onClick={(e) => e.stopPropagation()}>
                <Popconfirm
                  title="Sure to set?"
                  onConfirm={() => {
                    setStockQuant(record);
                  }}
                >
                  <IoMdSettings color="#4a819e" className="cursor-pointer" />
                  Set
                </Popconfirm>
              </Space>
            </>
          )}
        </Space>
      ),
    },
  ];

  useEffect(() => {
    if (stockQuantData) {
      const data: DataType[] = [];
      for (let i = 0; i < stockQuantData?.length; ++i) {
        data.push({
          key: stockQuantData[i].id,
          id: stockQuantData[i].id,
          productProduct: stockQuantData[i].productProduct,
          stockLocation: stockQuantData[i].stockLocation,
          inventoryDate: stockQuantData[i].inventoryDate,
          quantity: stockQuantData[i].quantity,
          inventoryQuantity: stockQuantData[i].inventoryQuantity,
          inventoryDiffQuantity: stockQuantData[i].inventoryDiffQuantity,
          inventoryQuantitySet: stockQuantData[i].inventoryQuantitySet,
          uomUom: stockQuantData[i].uomUom,
        });
        countedQuantity[stockQuantData[i].id] =
          stockQuantData[i].inventoryQuantity;
        setData(data);
        setCountedQuantity(countedQuantity);
      }
    }
  }, [stockQuantData]);
  return (
    <>
      <Table
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              // router.push(`/products/${record?.id}`);
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

export default StockQuantProductTable;
