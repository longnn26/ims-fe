"use client";

import useSelector from "@hooks/use-selector";
import { dateAdvFormat } from "@utils/constants";
import { Divider, TableColumnsType, message } from "antd";
import { Button, Space, Table, Tooltip } from "antd";
import moment from "moment";
import { IpAddress } from "@models/ipAddress";
import { useRouter } from "next/router";
import { IpSubnet } from "@models/ipSubnet";
import { MdAssignmentAdd, MdOutlineManageHistory } from "react-icons/md";
import { TbBinary, TbBinaryOff, TbLockOpenOff } from "react-icons/tb";
import ipAddress from "@services/ipAddress";
import { useSession } from "next-auth/react";

interface Props {
  onEdit: (data: IpAddress) => void;
  onDelete: (data: IpAddress) => void;
  onBlock: (record: IpAddress) => void;
  ipSubnet: IpSubnet;
}

interface DataType {
  key: React.Key;
  id: number;
  address: string;
  blocked: boolean;
  reason: string;
  isReserved: boolean;
  purpose: string;
  ipSubnetId: number;
  ipSubnet: IpSubnet;
  dateCreated: string;
  dateUpdated: string;
}

const IpAddressable: React.FC<Props> = (props) => {
  const { onEdit, onDelete, onBlock, ipSubnet } = props;
  const router = useRouter();
  const { data: session } = useSession();
  const { ipAddressData, ipAddressDataLoading } = useSelector(
    (state) => state.ipSubnet
  );

  const columns: TableColumnsType<DataType> = [
    {
      title: "IP Address",
      key: "address",
      dataIndex: "address",
      fixed: "left",
    },
    {
      title: "Blocked",
      key: "blocked",
      render: (_, record) => (
        <p className="">{record.blocked ? "Yes" : "No"}</p>
      ),
    },
    {
      title: "(Un)Blocked Reason",
      key: "reason",
      dataIndex: "reason",
    },
    {
      title: "Reserved",
      key: "isReserved",
      render: (_, record) => (
        <p className="">{record.isReserved ? "Yes" : "No"}</p>
      ),
    },
    {
      title: "Type",
      dataIndex: "purpose",
      key: "purpose",
      render: (_, record) => (
        <p className="">{record.purpose === "Host" ? "" : record.purpose}</p>
      ),
    },
    {
      title: "Action",
      key: "operation",
      render: (record: IpSubnet) => (
        <Space wrap>
          <Tooltip title="View History" color={"black"}>
            <Button onClick={() => router.push(`/ipSubnet/${ipSubnet.id}/ipAddress/${record.id}`)}>
              <MdOutlineManageHistory />
            </Button>
          </Tooltip>
          {/* <Tooltip title="Delete" color={"black"}>
            <Button onClick={() => onDelete(record)}>
              <AiFillDelete />
            </Button>
          </Tooltip> */}
        </Space>
      ),
    },
    // {
    //   title: "Date Updated",
    //   dataIndex: "dateUpdated",
    //   key: "dateUpdated",
    // },
    // {
    //   title: "Action",
    //   key: "operation",
    //   render: (record: IpAddress) => (
    //     <Space wrap>
    //       <Tooltip title="Assign" color={"black"}>
    //         <Button onClick={() => {}}>
    //           <MdAssignmentAdd />
    //         </Button>
    //       </Tooltip>
    //       {(record.blocked === false
    //       // && record.purpose !== "Gateway"
    //       // && record.purpose !== "Network"
    //       // && record.purpose !== "Broadcast"
    //       && record.purpose === "Host") && (
    //         <Tooltip title="Block" color={"black"}>
    //           <Button onClick={() => {onBlock(record)}}>
    //             <TbBinaryOff />
    //           </Button>
    //         </Tooltip>
    //       )}
    //       {/* hỏi xem là có case unblock không?
    //       {(record.blocked === true)&& (
    //           <Tooltip title="Unblock" color={"black"}>
    //             <Button onClick={() => {onBlock(record)}}>
    //               <TbBinary />
    //             </Button>
    //           </Tooltip>
    //         )} */}
    //     </Space>
    //   ),
    // },
  ];

  const data: DataType[] = [];
  for (let i = 0; i < ipAddressData?.data?.length; ++i) {
    data.push({
      key: ipAddressData?.data[i].id,
      id: ipAddressData?.data[i].id,
      address: ipAddressData?.data[i].address,
      blocked: ipAddressData?.data[i].blocked,
      isReserved: ipAddressData?.data[i].isReserved,
      purpose: ipAddressData?.data[i].purpose,
      reason: ipAddressData.data[i].reason,
      ipSubnetId: ipAddressData?.data[i].ipSubnetId,
      ipSubnet: ipAddressData?.data[i].ipSubnet,
      dateCreated: moment(ipAddressData?.data[i].dateCreated).format(
        dateAdvFormat
      ),
      dateUpdated: moment(ipAddressData?.data[i].dateUpdated).format(
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
        loading={ipAddressDataLoading}
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    </div>
  );
};

export default IpAddressable;
