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
import { getStockPickingIncomings } from "@slices/stockPickingIncoming";
import { StockLocation } from "@models/stockLocation";

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
}

const StockPickingIncomingTable: React.FC<Props> = (props) => {
  const dispatch = useDispatch();
  const { accessToken, warehouseId } = props;
  const { data: stockPickingIncomingData, loading } = useSelector(
    (state) => state.stockPickingIncoming
  );
  const [data, setData] = useState<DataType[]>([]);

  // const deleteProductProduct = async (record: DataType) => {
  //   await productProductServices
  //     .deleteProductProduct(accessToken, record.id)
  //     .then(() => {
  //       dispatch(
  //         getProductVariants({
  //           token: accessToken,
  //           productTmplId: productTmplId,
  //         })
  //       );
  //     })
  //     .catch((error) => {
  //       message.error(error?.response?.data);
  //     });
  // };
  const columns: TableColumnsType<DataType> = [
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
      title: "Scheduled Date",
      render: (record: DataType) => (
        <>
          <p>{record.scheduledDate}</p>
        </>
      ),
    },
    {
      title: "Deadline",
      render: (record: DataType) => (
        <>
          <p>{record.dateDeadline}</p>
        </>
      ),
    },
    {
      title: "Effective Date",
      render: (record: DataType) => (
        <>
          <p>{record.dateDone}</p>
        </>
      ),
    },
    {
      key: "operation",
      width: "15%",
      render: (record: DataType) => (
        <Space wrap>
          <Popconfirm title="Sure to delete?" onConfirm={() => {}}>
            <AiFillDelete className="cursor-pointer" />
          </Popconfirm>
        </Space>
      ),
    },
  ];
  useEffect(() => {
    if (stockPickingIncomingData) {
      const newData: DataType[] = stockPickingIncomingData.map((item) => ({
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
      }));
      setData(newData);
    }
  }, [stockPickingIncomingData]);

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

export default StockPickingIncomingTable;
