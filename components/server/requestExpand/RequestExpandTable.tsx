"use client";

import useSelector from "@hooks/use-selector";
import { Appointment } from "@models/appointment";
import { Customer } from "@models/customer";
import { RequestExpand } from "@models/requestExpand";
import { RequestUpgrade } from "@models/requestUpgrade";
import { dateAdvFormat, requestUpgradeStatus } from "@utils/constants";
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
import { AiFillDelete } from "react-icons/ai";
import { BiEdit, BiSolidCommentDetail } from "react-icons/bi";

interface Props {
  typeGet?: string;
  serverAllocationId?: string;
  urlOncell?: string;
  onEdit: (data: RequestUpgrade) => void;
  onDelete: (data: RequestUpgrade) => void;
}

interface DataType {
  key: React.Key;
  id: number;
  status: string;
  removalStatus: string;
  requestType: string;
  note: string;
  techNote: string;
  serverAllocationId: number;
  dateCreated: string;
  dateUpdated: string;
  size: number;
  customer: Customer;
  succeededAppointment: Appointment;
  companyName: string;
  name: string;
}

const RequestExpandTable: React.FC<Props> = (props) => {
  const { onEdit, onDelete, urlOncell, typeGet } = props;
  const router = useRouter();
  const { requestExpandDataLoading, requestExpandData } = useSelector(
    (state) => state.requestExpand
  );
  const { requestExpandData: rEDataOfAppointment } = useSelector(
    (state) => state.appointment
  );
  var listData =
    typeGet == "All"
      ? requestExpandData
      : typeGet == "ByAppointmentId"
      ? rEDataOfAppointment
      : requestExpandData;
  const columns: TableColumnsType<DataType> = [
    { title: "Server Name", dataIndex: "name", key: "name" },
    { title: "Customer", dataIndex: "companyName", key: "companyName" },
    { title: "Expand size (U)", dataIndex: "size", key: "size" },
    { title: "Type", dataIndex: "requestType", key: "requestType" },
    {
      title: "Status",
      key: "status",
      render: (record: RequestUpgrade) => {
        var statusData = requestUpgradeStatus.find(
          (_) => _.value === record.status
        );
        return (
          <Tag className=" w-2/3 text-center" color={statusData?.color}>
            {statusData?.value}
          </Tag>
        );
      },
    },
    // { title: "Note", dataIndex: "note", key: "note" },
    { title: "Date Created", dataIndex: "dateCreated", key: "dateCreated" },
    // { title: "Date Updated", dataIndex: "dateUpdated", key: "dateUpdated" },
    {
      title: "Action",
      key: "operation",
      render: (record: RequestExpand) => (
        <Space wrap>
          <Tooltip title="View detail" color={"black"}>
            <Button
              onClick={() =>
                router.push(`${urlOncell}/requestExpand/${record.id}`)
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
      status: listData?.data[i].status,
      removalStatus: listData?.data[i].removalStatus,
      requestType: listData?.data[i].requestType,
      note: listData?.data[i].note,
      techNote: listData?.data[i].techNote,
      serverAllocationId: listData?.data[i].serverAllocationId,
      size: listData?.data[i].size,
      customer: listData?.data[i].customer,
      succeededAppointment: listData?.data[i].succeededAppointment,
      dateCreated: moment(listData?.data[i].dateCreated).format(dateAdvFormat),
      dateUpdated: moment(listData?.data[i].dateUpdated).format(dateAdvFormat),
      companyName: listData?.data[i].customer.companyName,
      name: listData?.data[i].serverAllocation.name,
    });
  }

  return (
    <div className="shadow m-5">
      <Divider orientation="left" plain>
        <h3>Server Allocation Request</h3>
      </Divider>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        // className="cursor-pointer"
      />
    </div>
  );
};

export default RequestExpandTable;
