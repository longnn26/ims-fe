"use client";

import useSelector from "@hooks/use-selector";
import { dateAdvFormat } from "@utils/constants";
import { Divider, TableColumnsType } from "antd";
import { Button, Space, Table, Tooltip } from "antd";
import moment from "moment";
import { IpAddress } from "@models/ipAddress";
import { useRouter } from "next/router";
import { IpSubnet } from "@models/ipSubnet";
import { MdAssignmentAdd } from "react-icons/md";
import { TbLockOpenOff } from "react-icons/tb";

interface Props {
  onEdit: (data: IpAddress) => void;
  onDelete: (data: IpAddress) => void;
}

interface DataType {
  key: React.Key;
  id: number;
  address: string;
  blocked: boolean;
  isReserved: boolean;
  purpose: string;
  ipSubnetId: number;
  ipSubnet: IpSubnet;
  dateCreated: string;
  dateUpdated: string;
}

const IpAddressable: React.FC<Props> = (props) => {
  const { onEdit, onDelete } = props;
  const router = useRouter();
  const { ipAddressData, ipAddressDataLoading } = useSelector(
    (state) => state.ipSubnet
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
      title: "IP Address",
      key: "address",
      dataIndex: "address",
    },
    {
      title: "Blocked",
      key: "blocked",
      render: (_, record) => (
        <p className="">{record.blocked ? "Yes" : "No"}</p>
      ),
    },
    {
      title: "Reserved",
      key: "isReserved",
      render: (_, record) => (
        <p className="">{record.isReserved ? "Yes" : "No"}</p>
      ),
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
    //   title: "Date Updated",
    //   dataIndex: "dateUpdated",
    //   key: "dateUpdated",
    // },
    {
      title: "Action",
      key: "operation",
      render: (record: IpSubnet) => (
        <Space wrap>
          <Tooltip title="Assign" color={"black"}>
            <Button onClick={() => {}}>
              <MdAssignmentAdd />
            </Button>
          </Tooltip>
          <Tooltip title="Block" color={"black"}>
            <Button onClick={() => {}}>
              <TbLockOpenOff />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
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
        scroll={{ x: 1300 }}
        pagination={false}
      />
    </div>
  );
};

export default IpAddressable;