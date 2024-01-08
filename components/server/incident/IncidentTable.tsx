"use client";

import useSelector from "@hooks/use-selector";
import { Appointment } from "@models/appointment";
import { Customer } from "@models/customer";
import { Incident } from "@models/incident";
import { dateAdvFormat } from "@utils/constants";
import {
  Badge,
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
  typeGet?: string;
  serverAllocationId?: string;
  urlOncell?: string;
  //   onEdit: (data: RequestUpgrade) => void;
  //   onDelete: (data: RequestUpgrade) => void;
}

interface DataType {
  key: React.Key;
  id: number;
  description: string;
  serverAllocationId: number;
  dateCreated: string;
  dateUpdated: string;
  dateResolved: string;
  customer: Customer;
  isResolvByClient: boolean;
  isResolved: boolean;
  solution: string;
}

const IncidentTable: React.FC<Props> = (props) => {
  const { urlOncell, typeGet } = props;
  const router = useRouter();
  const { incidentDataLoading, incidentData } = useSelector(
    (state) => state.incident
  );

  var listData =
    typeGet == "All"
      ? incidentData
      : typeGet == "ByAppointmentId"
      ? incidentData
      : incidentData;
  const columns: TableColumnsType<DataType> = [
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Solution", dataIndex: "solution", key: "solution" },
    {
      title: "Status",
      dataIndex: "isResolved",
      key: "isResolved",
      render: (isResolved: boolean) => (
        <>
          {isResolved ? (
            <Badge status="success" text="Resolved" />
          ) : (
            <Badge status="warning" text="Resolving" />
          )}
        </>
      ),
    },
    {
      title: "Resolver",
      dataIndex: "isResolvByClient",
      key: "isResolvByClient",
      render: (isResolvByClient: boolean) => (
        <>
          {isResolvByClient ? (
            <span>Customer</span>
          ) : (
            <span>Quang Trung Staff</span>
          )}
        </>
      ),
    },
    {
      title: "Date Resolved",
      dataIndex: "dateResolved",
      key: "dateResolved",
      render: (record: Incident) => (
        <>
          {record.dateResolved !== null ? (
            record.dateResolved
          ) : (
            <span style={{ display: "none" }}></span>
          )}
        </>
      ),
    },
    { title: "Date Created", dataIndex: "dateCreated", key: "dateCreated" },
    // { title: "Date Updated", dataIndex: "dateUpdated", key: "dateUpdated" },

    {
      title: "Action",
      key: "operation",
      render: (record: Incident) => (
        <Space wrap>
          <Tooltip title="View detail" color={"black"}>
            <Button
              onClick={() => router.push(`${urlOncell}/incident/${record.id}`)}
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
      description: listData?.data[i].description,
      serverAllocationId: listData?.data[i].serverAllocationId,
      customer: listData?.data[i].customer,
      dateCreated: moment(listData?.data[i].dateCreated).format(dateAdvFormat),
      dateUpdated: moment(listData?.data[i].dateUpdated).format(dateAdvFormat),
      dateResolved: moment(listData?.data[i].dateResolved).format(
        dateAdvFormat
      ),
      isResolvByClient: listData?.data[i].isResolvByClient,
      isResolved: listData?.data[i].isResolved,
      solution: listData?.data[i].solution,
    });
  }

  return (
    <div className="shadow m-5">
      <Divider orientation="left" plain>
        <h3>Incident Table</h3>
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

export default IncidentTable;
