"use client";

import useSelector from "@hooks/use-selector";
import { dateAdvFormat } from "@utils/constants";
import { Divider, TableColumnsType, message } from "antd";
import { Button, Space, Table, Tooltip } from "antd";
import moment from "moment";
import { IpAddress } from "@models/ipAddress";
import { useRouter } from "next/router";

import { useSession } from "next-auth/react";

interface Props {
  onEdit: (data: IpAddress) => void;
  onDelete: (data: IpAddress) => void;
  onBlock: (record: IpAddress) => void;
}

interface DataType {
  key: React.Key;
  dateExecuted?: string;
  isBlock?: boolean;
  reason?: string;
  name: string;
  address: string;
  companyName: string;
  dateCreated: string;
  dateUpdated: string;
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
      dataIndex: "name",
      fixed: "left",
    },
    {
      title: "IP Address",
      key: "address",
      dataIndex: "address",
    },
    {
      title: "(Un)Blocked Reason",
      key: "reason",
      dataIndex: "reason",
    },

    {
      title: "Purpose",
      dataIndex: "purpose",
      key: "purpose",
    },
    {
      title: "Date Created",
      dataIndex: "dateCreated",
      key: "dateCreated",
    },
    // {
    //   title: "Action",
    //   key: "operation",
    //   render: (record: IpSubnet) => (
    //     <Space wrap>
    //       <Tooltip title="View History" color={"black"}>
    //         <Button onClick={() => router.push(`/ipAddress/${record.id}`)}>
    //           <MdOutlineManageHistory />
    //         </Button>
    //       </Tooltip>
    //     </Space>
    //   ),
    // },
  ];

  const data: DataType[] = [];
  for (let i = 0; i < ipAddressHistoryData?.data?.length; ++i) {
    data.push({
      key: ipAddressHistoryData?.data[i].id,
      address: ipAddressHistoryData?.data[i].masterIp.address,
      isBlock: ipAddressHistoryData?.data[i].isBlock,
      reason: ipAddressHistoryData?.data[i].reason,
      name: ipAddressHistoryData?.data[i].currentServer.name,
      dateExecuted: moment(ipAddressHistoryData?.data[i].dateExecuted).format(
        dateAdvFormat
      ),
      dateCreated: moment(ipAddressHistoryData?.data[i].dateCreated).format(
        dateAdvFormat
      ),
      dateUpdated: moment(ipAddressHistoryData?.data[i].dateUpdated).format(
        dateAdvFormat
      ),
      companyName: ipAddressHistoryData?.data[i].customer.companyName,
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
