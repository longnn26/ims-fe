"use client";

import useSelector from "@hooks/use-selector";
import {
  Input,
  TableColumnsType,
  message,
  Space,
  Popconfirm,
  Tag,
  Select,
} from "antd";
import { Table } from "antd";
import useDispatch from "@hooks/use-dispatch";
import stockPickingServices from "@services/stockPicking";
import stockMoveServices from "@services/stockMove";
import { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { StockPickingInfo } from "@models/stockPicking";
import { getStockPickingIncomings } from "@slices/stockPickingIncoming";
import { StockLocation } from "@models/stockLocation";
import { useRouter } from "next/router";
import { getStockPickingTagColor } from "@utils/helpers";
import { dateAdvFormat } from "@utils/constants";
import moment from "moment";
import dayjs from "dayjs";
import { ProductProduct } from "@models/productProduct";
import { UomUom } from "@models/uomUom";
import { getStockMoves } from "@slices/stockMove";
import { StockMoveQuantityUpdate } from "@models/stockMove";

const { Option } = Select;

interface Props {
  accessToken: string;
  pickingId: string;
  onRefresh: () => void;
}

interface DataType {
  key: React.Key;
  id: string;
  productProduct: ProductProduct;
  uomUom: UomUom;
  location: StockLocation;
  locationDest: StockLocation;
  pickingId: string;
  name: string;
  state: string;
  reference: string;
  descriptionPicking: string;
  productQty: number;
  productUomQty: number;
  quantity: number;
  reservationDate: string;
}

const StockMoveTable: React.FC<Props> = (props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { accessToken, pickingId, onRefresh } = props;
  const { data: stockMoveData, loading } = useSelector(
    (state) => state.stockMove
  );
  const [data, setData] = useState<DataType[]>([]);
  // const [columns, setColumns] = useState<TableColumnsType<DataType>>([]);
  const [quantity, setQuantity] = useState<{
    [key: string]: number;
  }>({});

  const deletetockPicking = async (record: DataType) => {
    await stockMoveServices
      .deleteStockMove(accessToken, record.id)
      .then(() => {
        dispatch(
          getStockMoves({
            token: accessToken,
            pickingId: pickingId,
          })
        );
        onRefresh();
      })
      .catch((error) => {
        message.error(error?.response?.data);
      });
  };

  const handleBlurQuantity = async (
    event: React.FocusEvent<HTMLInputElement>,
    record: DataType
  ) => {
    const newValue = event.target.value;
    if (newValue && Number.parseFloat(newValue) !== record.quantity) {
      await stockMoveServices
        .updateQuantity(accessToken, {
          id: record.id,
          quantity: Number.parseFloat(newValue),
        } as StockMoveQuantityUpdate)
        .then(() => {
          dispatch(
            getStockMoves({
              token: accessToken,
              pickingId: pickingId,
            })
          );
        })
        .catch((error) => {
          message.error(error?.response?.data);
        });
    }
  };
  const columns: TableColumnsType<DataType> = [
    {
      title: "Product",
      align: "center",
      width: "40%",
      render: (record: DataType) => (
        <>
          {" "}
          <p>{`${record.productProduct.name} (${record.productProduct.pvcs
            .map((pvc) => `${pvc.value}`)
            .join(", ")})`}</p>
        </>
      ),
    },
    {
      title: "Demand",
      align: "center",
      render: (record: DataType) => (
        <>
          <p>{record.productUomQty}</p>
        </>
      ),
    },
    {
      title: "Quantity",
      align: "center",
      render: (record: DataType) => (
        <Input
          disabled={record.state !== "Assigned"}
          required
          type="number"
          style={{ cursor: "pointer" }}
          placeholder="0"
          variant="filled"
          value={quantity![record.id]}
          onChange={(event) => {
            setQuantity({
              ...quantity,
              [record.id]: Number.parseFloat(event.target.value),
            });
          }}
          onBlur={(event) => {
            handleBlurQuantity(event, record);
          }}
        />
      ),
    },
    {
      title: "Unit",
      align: "center",
      render: (record: DataType) => (
        <>
          <p>{record.uomUom.name}</p>
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
              deletetockPicking(record);
            }}
          >
            <AiFillDelete className="cursor-pointer" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    if (stockMoveData.length > 0) {
      const data: DataType[] = [];
      for (let i = 0; i < stockMoveData?.length; ++i) {
        data.push({
          key: stockMoveData[i].id,
          id: stockMoveData[i].id,
          productProduct: stockMoveData[i].productProduct,
          uomUom: stockMoveData[i].uomUom,
          location: stockMoveData[i].location,
          locationDest: stockMoveData[i].locationDest,
          pickingId: stockMoveData[i].pickingId,
          name: stockMoveData[i].name,
          state: stockMoveData[i].state,
          reference: stockMoveData[i].reference,
          descriptionPicking: stockMoveData[i].descriptionPicking,
          productQty: stockMoveData[i].productQty,
          productUomQty: stockMoveData[i].productUomQty,
          quantity: stockMoveData[i].quantity,
          reservationDate: stockMoveData[i].reservationDate,
        });
        quantity[stockMoveData[i].id] = stockMoveData[i].quantity;
        setData(data);
        setQuantity(quantity);
      }
    } else {
      setData([]);
    }
  }, [stockMoveData]);

  return (
    <>
      <Table
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              // router.push(`/overview/${warehouseId}/${record?.id}`);
            },
          };
        }}
        loading={loading}
        columns={columns}
        dataSource={data}
        bordered
        pagination={false}
      />
    </>
  );
};

export default StockMoveTable;
