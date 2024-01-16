"use client";

import useSelector from "@hooks/use-selector";
import {
  ROLE_TECH,
  dateAdvFormat,
  serverAllocationStatus,
} from "@utils/constants";
import { Divider, TableColumnsType, Tag } from "antd";
import { Button, Space, Table, Tooltip } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { BiSolidCommentDetail } from "react-icons/bi";
import moment from "moment";
import { ServerAllocation } from "@models/serverAllocation";
import { useRouter } from "next/router";
import { Customer } from "@models/customer";
import { IpAddress } from "@models/ipAddress";
import { ServerAllocationData } from "@models/serverAllocation";
import { areInArray } from "@utils/helpers";
import { useSession } from "next-auth/react";

interface Props {
  data: ServerAllocationData | undefined;
  onEdit: (data: ServerAllocation) => void;
  urlOncell?: string;
}

interface DataType {
  key: React.Key;
  id: number;
  masterIp: IpAddress;
  masterIpAddress: string;
  name: string;
  customerId: number;
  customer: Customer;
  status: string;
  dateCreated: string;
}

const ServerAllocationTable: React.FC<Props> = (props) => {
  const { data, onEdit, urlOncell } = props;
  const { data: session } = useSession();
  const router = useRouter();
  const { serverAllocationDataLoading, serverAllocationData } = useSelector(
    (state) => state.serverAllocation
  );

  const columns: TableColumnsType<DataType> = [
    {
      title: "Server's IP",
      key: "masterIpAddress",
      render: (record: ServerAllocation) =>
        `${
          record.masterIp?.address != undefined ? record.masterIp?.address : ""
        }`,
    },
    {
      title: "Server Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Customer",
      key: "customer",
      render: (record: ServerAllocation) => `${record.customer?.companyName}`,
    },
    {
      title: "Status",
      // dataIndex: "status",
      key: "status",
      render: (record: ServerAllocation) => {
        var statusData = serverAllocationStatus.find(
          (_) => _.value === record.status
        );
        return <Tag color={statusData?.color}>{statusData?.value}</Tag>;
      },
    },
    {
      title: "Requested At",
      dataIndex: "dateCreated",
      key: "dateCreated",
    },
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
          {areInArray(session?.user.roles!, ROLE_TECH) && (
            <Tooltip title="Edit" color={"black"}>
              <Button onClick={() => onEdit(record)}>
                <BiEdit />
              </Button>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  // const data: DataType[] = [];
  // for (let i = 0; i < serverAllocationData?.data?.length; ++i) {
  //     data.push({
  //         key: serverAllocationData?.data[i].id,
  //         id: serverAllocationData?.data[i].id,
  //         masterIp: serverAllocationData?.data[i].masterIp,
  //         masterIpAddress: serverAllocationData?.data[i].masterIp?.address,
  //         name: serverAllocationData?.data[i].name,
  //         customerId: serverAllocationData?.data[i].customerId,
  //         customer: serverAllocationData?.data[i].customer,
  //         status: serverAllocationData?.data[i].status,
  //         dateCreated: moment(serverAllocationData?.data[i].dateCreated).format(
  //             dateAdvFormat
  //         ),
  //     });
  // }

  const formattedData: DataType[] =
    data?.data?.map((item) => ({
      key: item.id,
      id: item.id,
      masterIp: item.masterIp,
      masterIpAddress: item.masterIp?.address ?? "",
      name: item.name,
      customerId: item.customerId,
      customer: item.customer,
      status: item.status,
      dateCreated: moment(item.dateCreated).format(dateAdvFormat),
    })) || [];

  return (
    <div className="shadow">
      <Table
        loading={serverAllocationDataLoading}
        columns={columns}
        dataSource={formattedData}
        pagination={false}
      />
    </div>
  );
};

export default ServerAllocationTable;
