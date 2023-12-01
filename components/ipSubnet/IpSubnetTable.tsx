"use client";

import useSelector from "@hooks/use-selector";
import { dateAdvFormat } from "@utils/constants";
import { TableColumnsType } from "antd";
import { Button, Space, Table, Tooltip } from "antd";
import { BiEdit, BiSolidCommentDetail } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import moment from "moment";
import { IpSubnet } from "@models/ipSubnet";
import { useRouter } from "next/router";

interface Props {
  onEdit: (data: IpSubnet) => void;
  onDelete: (data: IpSubnet) => void;
}

interface DataType {
  key: React.Key;
  id: number;
  firstOctet: number;
  secondOctet: number;
  thirdOctet: number;
  fourthOctet: number;
  prefixLength: number;
  note: string;
  parentNetworkId: number;
  subnetIds: IpSubnet[];
  dateCreated: string;
  dateUpdated: string;
}

const IpSubnetTable: React.FC<Props> = (props) => {
  const { onEdit, onDelete } = props;
  const router = useRouter();
  const { ipSubnetDataLoading, ipSubnetData } = useSelector(
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
      key: "ipAddress",
      render: (_, record) => (
        <p className="text-[#b75c3c] hover:text-[#ee4623]">{`${record.firstOctet}.${record.secondOctet}.${record.thirdOctet}.${record.fourthOctet}/${record.prefixLength}`}</p>
      ),
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
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
          <Tooltip title="View detail" color={"black"}>
            <Button onClick={() => router.push(`/ipSubnet/${record.id}`)}>
              <BiSolidCommentDetail />
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
  ];

  const data: DataType[] = [];
  for (let i = 0; i < ipSubnetData?.data?.length; ++i) {
    data.push({
      key: ipSubnetData?.data[i].id,
      id: ipSubnetData?.data[i].id,
      firstOctet: ipSubnetData?.data[i].firstOctet,
      secondOctet: ipSubnetData?.data[i].secondOctet,
      thirdOctet: ipSubnetData?.data[i].thirdOctet,
      fourthOctet: ipSubnetData?.data[i].fourthOctet,
      prefixLength: ipSubnetData?.data[i].prefixLength,
      note: ipSubnetData?.data[i].note,
      parentNetworkId: ipSubnetData?.data[i].parentNetworkId,
      subnetIds: ipSubnetData?.data[i].subnetIds,
      dateCreated: moment(ipSubnetData?.data[i].dateCreated).format(
        dateAdvFormat
      ),
      dateUpdated: moment(ipSubnetData?.data[i].dateUpdated).format(
        dateAdvFormat
      ),
    });
  }

  return (
    <>
      <Table
        loading={ipSubnetDataLoading}
        columns={columns}
        dataSource={data}
        scroll={{ x: 1300 }}
        pagination={false}
      />
    </>
  );
};

export default IpSubnetTable;
