"use client";

import useSelector from "@hooks/use-selector";
import { dateAdvFormat } from "@utils/constants";
import { TableColumnsType } from "antd";
import { Button, Space, Table, Tooltip } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import moment from "moment";
import { Area } from "@models/area";
import { useRouter } from "next/router";

interface Props {
  onEdit: (data: Area) => void;
  onDelete: (data: Area) => void;
}

interface DataType {
  key: React.Key;
  id: number;
  name: string;
  rowCount: number;
  columnCount: number;
  dateCreated: string;
  dateUpdated: string;
}

const AreaTable: React.FC<Props> = (props) => {
  const { onEdit, onDelete } = props;
  const router = useRouter();
  const { areaDataLoading, areaData } = useSelector((state) => state.area);

  const columns: TableColumnsType<DataType> = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      fixed: "left",
      render: (text) => (
        <a className="text-[#b75c3c] hover:text-[#ee4623]">{text}</a>
      ),
      onCell: (record, rowIndex) => {
        return {
          onClick: (ev) => {
            router.push(`/area/${record.id}`);
          },
        };
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      onCell: (record, rowIndex) => {
        return {
          onClick: (ev) => {
            router.push(`/area/${record.id}`);
          },
        };
      },
    },
    {
      title: "Row Count",
      dataIndex: "rowCount",
      key: "rowCount",
      onCell: (record, rowIndex) => {
        return {
          onClick: (ev) => {
            router.push(`/area/${record.id}`);
          },
        };
      },
    },
    {
      title: "Column Count",
      dataIndex: "columnCount",
      key: "columnCount",
      onCell: (record, rowIndex) => {
        return {
          onClick: (ev) => {
            router.push(`/area/${record.id}`);
          },
        };
      },
    },
    {
      title: "Date Created",
      dataIndex: "dateCreated",
      key: "dateCreated",
      onCell: (record, rowIndex) => {
        return {
          onClick: (ev) => {
            router.push(`/area/${record.id}`);
          },
        };
      },
    },
    {
      title: "Date Updated",
      dataIndex: "dateUpdated",
      key: "dateUpdated",
      onCell: (record, rowIndex) => {
        return {
          onClick: (ev) => {
            router.push(`/area/${record.id}`);
          },
        };
      },
    },
    {
      title: "Action",
      key: "operation",
      render: (record: Area) => (
        <Space wrap>
          <Tooltip title="Edit" color={"black"}>
            <Button onClick={() => onEdit(record)}>
              <BiEdit />
            </Button>
          </Tooltip>
          <Tooltip title="Delete" color={"black"}>
            <Button onClick={() => onDelete(record)}>
              <AiFillDelete />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const data: DataType[] = [];
  for (let i = 0; i < areaData?.data?.length; ++i) {
    data.push({
      key: areaData?.data[i].id,
      id: areaData?.data[i].id,
      name: areaData?.data[i].name,
      rowCount: areaData?.data[i].rowCount,
      columnCount: areaData?.data[i].columnCount,
      dateCreated: moment(areaData?.data[i].dateCreated).format(dateAdvFormat),
      dateUpdated: moment(areaData?.data[i].dateUpdated).format(dateAdvFormat),
    });
  }

  return (
    <>
      <Table
        loading={areaDataLoading}
        columns={columns}
        dataSource={data}
        scroll={{ x: 1300 }}
        pagination={false}
      />
    </>
  );
};

export default AreaTable;
