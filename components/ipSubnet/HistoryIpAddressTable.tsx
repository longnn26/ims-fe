"use client";

import useSelector from "@hooks/use-selector";
import { dateAdvFormat } from "@utils/constants";
import { Divider, TableColumnsType, message } from "antd";
import { Button, Space, Table, Tooltip } from "antd";
import moment from "moment";
import { IpAddress } from "@models/ipAddress";
import { useRouter } from "next/router";

import { useSession } from "next-auth/react";
import { User } from "@models/user";
import { ServerAllocation } from "@models/serverAllocation";

interface Props {
  onEdit: (data: IpAddress) => void;
  onDelete: (data: IpAddress) => void;
  onBlock: (record: IpAddress) => void;
}

interface DataType {
  key: React.Key;
  currentServer: ServerAllocation;
  currentServerId: number;
  dateExecuted: string;
  executor: User;
  ipAddress: IpAddress;
  isBlock: boolean;
  reason: string;
}

const HistoryIpAddressTable: React.FC<Props> = (props) => {
  const { onEdit, onDelete, onBlock } = props;
  const router = useRouter();
  const { data: session } = useSession();
  const { ipAddressHistoryData, ipAddressHistoryDataLoading } = useSelector(
    (state) => state.ipSubnet
  );

  const columns: TableColumnsType<DataType> = [
    {
      title: "Server Name",
      key: "name",
      render: (record: DataType) => {
        return record.currentServer.name;
      },
    },
    {
      title: "IP Address",
      key: "address",
      render: (record: DataType) => {
        return record.ipAddress.address;
      },
    },
    {
      title: "Action",
      key: "isBlock",
      render: (record: DataType) => {
        return record.isBlock.toString() === "true" ? "Blocked": "Unblocked";
      },
    },
    {
      title: "Reason",
      key: "reason",
      dataIndex: "reason",
    },

    {
      title: "Technical Staff",
      key: "actor",
      render: (record: DataType) => {
        return record.executor.fullname;
      },
    },
    {
      title: "Date Executed",
      dataIndex: "dateExecuted",
      key: "dateExecuted",
    },
  ];

  const data: DataType[] = [];
  console.log(ipAddressHistoryData);
  for (let i = 0; i < ipAddressHistoryData?.data?.length; ++i) {
    data.push({
      key: i,
      currentServer: ipAddressHistoryData?.data[i].currentServer,
      currentServerId: ipAddressHistoryData?.data[i].currentServerId,
      executor: ipAddressHistoryData?.data[i].executor,
      ipAddress: ipAddressHistoryData?.data[i].ipAddress,
      isBlock: ipAddressHistoryData?.data[i].isBlock,
      reason: ipAddressHistoryData?.data[i].reason,
      dateExecuted: moment(ipAddressHistoryData?.data[i].dateExecuted).format(
        dateAdvFormat
      ),
    });
  }

  return (
    <div className="shadow m-5">
      <Divider orientation="left" plain>
        <h3>{"Subnet's IPs"}</h3>
      </Divider>
      <Table
        loading={ipAddressHistoryDataLoading}
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    </div>
  );
};

export default HistoryIpAddressTable;
