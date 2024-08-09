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
import { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { StockPickingInfo } from "@models/stockPicking";
import { StockLocation } from "@models/stockLocation";
import { useRouter } from "next/router";
import { getStockPickingTagColor, getStockPickingTitle } from "@utils/helpers";
import { dateAdvFormat } from "@utils/constants";
import moment from "moment";
import dayjs from "dayjs";
import { RiBatteryShareLine } from "react-icons/ri";
import { getStockPickingInternals } from "@slices/stockPickingInternal";

const { Option } = Select;

interface Props {
  accessToken: string;
  warehouseId: string;
}

interface DataType {
  key: React.Key;
  id: string;
  location: StockLocation;
  locationDest: StockLocation;
  name: string;
  state: string;
  note: string;
  scheduledDate: string;
  dateDeadline: string;
  dateDone: string;
  backorderId?: string;
}

const StockPickingInternalTable: React.FC<Props> = (props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { accessToken, warehouseId } = props;
  const { data: stockPickingInternalData, loading } = useSelector(
    (state) => state.stockPickingInternal
  );
  const [data, setData] = useState<DataType[]>([]);

  const deletetockPicking = async (record: DataType) => {
    await stockPickingServices
      .deletetockPicking(accessToken, record.id)
      .then(() => {
        dispatch(
          getStockPickingInternals({
            token: accessToken,
            warehouseId: warehouseId,
          })
        );
      })
      .catch((error) => {
        message.error(error?.response?.data);
      });
  };
  const columns: TableColumnsType<DataType> = [
    {
      title: "Reference",
      width: "20%",
      fixed: "left",
      render: (record: DataType) => (
        <>
          <p>{record.name}</p>
        </>
      ),
    },
    {
      title: "From",
      render: (record: DataType) => (
        <>
          <p>{record.location.completeName}</p>
        </>
      ),
    },
    {
      title: "To",
      render: (record: DataType) => (
        <>
          <p>{record.locationDest.completeName}</p>
        </>
      ),
    },
    {
      title: "Back Order",
      align: "center",
      render: (record: DataType) => (
        <>{record.backorderId && <RiBatteryShareLine />}</>
      ),
    },
    {
      title: "Scheduled Date",
      render: (record: DataType) => (
        <>
          <p>
            {Boolean(record.scheduledDate)
              ? dayjs(record.scheduledDate).format(dateAdvFormat)
              : ""}
          </p>{" "}
        </>
      ),
    },
    {
      title: "Deadline",
      render: (record: DataType) => (
        <>
          <p>
            {Boolean(record.dateDeadline)
              ? dayjs(record.dateDeadline).format(dateAdvFormat)
              : ""}
          </p>
        </>
      ),
    },
    {
      title: "Effective Date",
      render: (record: DataType) => (
        <>
          <p>
            {Boolean(record.dateDone)
              ? moment(record.dateDone).format(dateAdvFormat)
              : ""}
          </p>
        </>
      ),
    },
    {
      title: "Status",
      render: (record: DataType) => (
        <>
          <Tag color={getStockPickingTagColor(record.state)}>
            {getStockPickingTitle(record.state)}
          </Tag>{" "}
        </>
      ),
    },

    {
      key: "operation",
      width: "15%",
      render: (record: DataType) => (
        <>
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
        </>
      ),
    },
  ];
  useEffect(() => {
    if (stockPickingInternalData) {
      const newData: DataType[] = stockPickingInternalData.map((item) => ({
        key: item.id,
        id: item.id,
        name: item.name,
        location: item.location,
        locationDest: item.locationDest,
        state: item.state,
        note: item.note,
        scheduledDate: item.scheduledDate,
        dateDeadline: item.dateDeadline,
        dateDone: item.dateDone,
        backorderId: item.backorderId,
      }));
      setData(newData);
    }
  }, [stockPickingInternalData]);

  return (
    <>
      <Table
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              router.push(`/overview/${warehouseId}/internal/${record?.id}`);
            },
          };
        }}
        className="custom-table"
        loading={loading}
        columns={columns}
        dataSource={data}
        bordered
        pagination={false}
        scroll={{ x: 1500 }}
      />
    </>
  );
};

export default StockPickingInternalTable;
