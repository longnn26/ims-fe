"use client";

import useSelector from "@hooks/use-selector";
import { dateAdvFormat, serverAllocationStatus } from "@utils/constants";
import { TableColumnsType, Tag } from "antd";
import { Button, Space, Table, Tooltip } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { BiSolidCommentDetail } from "react-icons/bi";
import moment from "moment";
import { ServerAllocation } from "@models/serverAllocation";
import { useRouter } from "next/router";
import { Customer } from "@models/customer";
import { IpAddress } from "@models/ipAddress";

interface Props {
  onEdit: (data: ServerAllocation) => void;
  onDelete: (data: ServerAllocation) => void;
}

interface DataType {
  key: React.Key;
  id: number;
  status: string;
  power: number;
  name: string;
  serialNumber: string;
  customer: Customer;
  note: string;
  techNote: string;
  dateCreated: string;
  masterIp: IpAddress;
  dateUpdated: string;
}

const ServerAllocationTable: React.FC<Props> = (props) => {
  const { onEdit, onDelete } = props;
  const router = useRouter();
  const { serverAllocationDataLoading, serverAllocationData } = useSelector(
    (state) => state.serverAllocation
  );

  const columns: TableColumnsType<DataType> = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      fixed: "left",
      render: (text) => (
        <p className="text-[#b75c3c] hover:text-[#ee4623]">{text}</p>
      ),
    },
    {
      title: "Server' IP",
      key: "masterIp",
      render: (record: ServerAllocation) => {
        return <p>{record?.masterIp?.address}</p>;
      },
    },
    { title: "Server Name", dataIndex: "name", key: "name" },
    {
      title: "Customer",
      key: "customer",
      render: (record: ServerAllocation) => {
        return <p>{record?.customer.companyName}</p>;
      },
    },
    {
      title: "Status",
      key: "status",
      render: (record: ServerAllocation) => {
        var statusData = serverAllocationStatus.find(
          (_) => _.value === record.status
        );
        return <Tag color={statusData?.color}>{statusData?.value}</Tag>;
      },
    },
    // { title: "Power", dataIndex: "power", key: "power" },
    // { title: "Serial Number", dataIndex: "serialNumber", key: "serialNumber" },
    // { title: "Note", dataIndex: "note", key: "note" },
    { title: "Date Request", dataIndex: "dateCreated", key: "dateCreated" },
    // { title: "Date Updated", dataIndex: "dateUpdated", key: "dateUpdated" },

    {
      title: "Action",
      key: "operation",
      render: (record: ServerAllocation) => (
        <Space wrap>
          <Tooltip title="View detail" color={"black"}>
            <Button onClick={() => router.push(`/server/${record.id}`)}>
              <BiSolidCommentDetail />
            </Button>
          </Tooltip>
          {Boolean(record.status === "Waiting") && (
            <>
              <Tooltip title="Edit" color={"black"}>
                <Button onClick={() => onEdit(record)}>
                  <BiEdit />
                </Button>
              </Tooltip>
            </>
          )}
          {/* <Tooltip title="Delete" color={"black"}>
            <Button onClick={() => onDelete(record)}>
              <AiFillDelete />
            </Button>
          </Tooltip> */}
        </Space>
      ),
    },
  ];

  const data: DataType[] = [];
  for (let i = 0; i < serverAllocationData?.data?.length; ++i) {
    data.push({
      key: serverAllocationData?.data[i].id,
      id: serverAllocationData?.data[i].id,
      status: serverAllocationData?.data[i].status,
      power: serverAllocationData?.data[i].power,
      name: serverAllocationData?.data[i].name,
      serialNumber: serverAllocationData?.data[i].serialNumber,
      note: serverAllocationData?.data[i].note,
      customer: serverAllocationData?.data[i].customer,
      masterIp: serverAllocationData?.data[i].masterIp,
      techNote: serverAllocationData?.data[i].techNote,
      dateCreated: moment(serverAllocationData?.data[i].dateCreated).format(
        dateAdvFormat
      ),
      dateUpdated: moment(serverAllocationData?.data[i].dateUpdated).format(
        dateAdvFormat
      ),
    });
  }

  return (
    <div className="shadow m-5">
      <Table
        loading={serverAllocationDataLoading}
        columns={columns}
        dataSource={data}
        scroll={{ x: 1300 }}
        pagination={false}
      />
    </div>
  );
};

export default ServerAllocationTable;
