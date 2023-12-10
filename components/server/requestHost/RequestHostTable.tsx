"use client";

import useSelector from "@hooks/use-selector";
import { Customer } from "@models/customer";
import { RequestHost } from "@models/requestHost";
import { ServerAllocation } from "@models/serverAllocation";
import { dateAdvFormat, requestHostStatus } from "@utils/constants";
import {
  Button,
  Divider,
  Space,
  Table,
  TableColumnsType,
  Tag,
  Tooltip,
} from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import { BiSolidCommentDetail } from "react-icons/bi";

interface Props {
  serverAllocationId?: string;
  // onEdit: (data: RequestUpgrade) => void;
}

interface DataType {
  key: React.Key;
  id: number;
  dateCreated: string;
  customer: Customer;
  serverAllocation: ServerAllocation;
  type: string;
  purpose: boolean;
  quantity: number;
  status: string;
}

const RequestHostTable: React.FC<Props> = (props) => {
  const { serverAllocationId } = props;
  const router = useRouter();
  const { requestHostDataLoading, requestHostData } = useSelector(
    (state) => state.requestHost
  );
  const columns: TableColumnsType<DataType> = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      fixed: "left",
    },
    { title: "Date Created", dataIndex: "dateCreated", key: "dateCreated" },
    {
      title: "Customer",
      key: "customer",
      render: (record: RequestHost) => <p className="">{record.customer.companyName}</p>,
    },
    {
      title: "Server's IP",
      key: "serverIP",
      render: (record: RequestHost) => (
        <p className="">{record.serverAllocation?.masterIpAddress}</p>
      ),
    },
    {
      title: "Type",
      key: "type",
      render: (record: RequestHost) => {
        return (
          <>
            {Boolean(record.type === "Additional") ? (
              <p>Ip</p>
            ) : (
              <p>{record.type}</p>
            )}
          </>
        );
      },
    },
    {
      title: "Purpose",
      key: "purpose",
      render: (record: RequestHost) => {
        return <>{Boolean(record.isRemoval) ? <p>Remove</p> : <p>Add</p>}</>;
      },
    },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    {
      title: "Status",
      key: "status",
      render: (record: RequestHost) => {
        var statusData = requestHostStatus.find(
          (_) => _.value === record.status
        );
        return (
          <Tag className=" w-2/3 text-center" color={statusData?.color}>
            {statusData?.value}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "operation",
      render: (record: RequestHost) => (
        <Space wrap>
          <Tooltip title="View detail" color={"black"}>
            <Button onClick={() => router.push(`/requestHost/${record.id}`)}>
              <BiSolidCommentDetail />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const data: DataType[] = [];
  for (let i = 0; i < requestHostData?.data?.length; ++i) {
    data.push({
      key: requestHostData?.data[i].id,
      id: requestHostData?.data[i].id,
      dateCreated: moment(requestHostData?.data[i].dateCreated).format(dateAdvFormat),
      customer: requestHostData?.data[i].customer,
      serverAllocation: requestHostData?.data[i].serverAllocation,
      type: requestHostData?.data[i].type,
      purpose: requestHostData?.data[i].isRemoval,
      quantity: requestHostData?.data[i].quantity,
      status: requestHostData?.data[i].status,
    });
  }

  return (
    <div className="shadow m-5">
      <Divider orientation="left" plain>
        <h3>Request Host</h3>
      </Divider>
      <Table
        columns={columns}
        dataSource={data}
        scroll={{ x: 1300 }}
        pagination={false}
      // className="cursor-pointer"
      />
    </div>
  );
};

export default RequestHostTable;
