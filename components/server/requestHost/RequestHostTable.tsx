"use client";

import useSelector from "@hooks/use-selector";
import { Customer } from "@models/customer";
import { RequestHost } from "@models/requestHost";
import { RequestUpgrade } from "@models/requestUpgrade";
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
  // const { requestExpandData: rEDataOfAppointment } = useSelector(
  //   (state) => state.appointment
  // );
  // var listData =
  //   typeGet == "All"
  //     ? requestHostData
  //     : typeGet == "ByAppointmentId"
  //     ? requestHostData
  //     : requestHostData;
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
    { title: "Date Created", dataIndex: "dateCreated", key: "dateCreated" },
    {
      title: "Customer",
      key: "customer",
      render: (_, record) => <p className="">{record.customer.companyName}</p>,
    },
    {
      title: "Server's IP",
      key: "serverIP",
      render: (_, record) => (
        <p className="">{record.serverIP?.masterIpAddress}</p>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (_, record) => {
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
      dataIndex: "purpose",
      render: (_, record) => {
        return <>{Boolean(record.purpose) ? <p>Remove</p> : <p>Add</p>}</>;
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
            <Button
              onClick={() =>
                router.push(`${urlOncell}/requestHost/${record.id}`)
              }
            >
              <BiSolidCommentDetail />
            </Button>
          </Tooltip>
          {/* <Tooltip title="Edit" color={"black"}>
            <Button onClick={() => onEdit(record)}>
              <BiEdit />
            </Button>
          </Tooltip>
          <Tooltip title="Delete" color={"black"}>
            <Button onClick={() => onDelete(record)}>
              <AiFillDelete />
            </Button>
          </Tooltip> */}
        </Space>
      ),
    },
  ];

  const data: DataType[] = [];
  for (let i = 0; i < listData?.data?.length; ++i) {
    data.push({
      key: listData?.data[i].id,
      id: listData?.data[i].id,
      dateCreated: moment(listData?.data[i].dateCreated).format(dateAdvFormat),
      customer: listData?.data[i].customer,
      serverIP: listData?.data[i].serverAllocation,
      type: listData?.data[i].type,
      purpose: listData?.data[i].isRemoval,
      quantity: listData?.data[i].quantity,
      status: listData?.data[i].status,
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
