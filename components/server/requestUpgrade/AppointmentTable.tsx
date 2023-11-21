"use client";

import useSelector from "@hooks/use-selector";
import { dateAdvFormat } from "@utils/constants";
import { Divider, TableColumnsType } from "antd";
import { Button, Space, Table, Tooltip } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import moment from "moment";
import { RequestUpgrade } from "@models/requestUpgrade";
import { useRouter } from "next/router";
import { Appointment } from "@models/appointment";

interface Props {
  onEdit: (data: Appointment) => void;
  onDelete: (data: Appointment) => void;
}

interface DataType {
  key: React.Key;
  id: number;
  appointedCustomer: string;
  dateAppointed: string;
  dateCheckedIn: string;
  dateCheckedOut: string;
  reason: string;
  note: string;
  techNote: string;
  isCorrectPerson: boolean;
  status: string;
  dateCreated: string;
  dateUpdated: string;
}

const AppointmentTable: React.FC<Props> = (props) => {
  const { onEdit, onDelete } = props;
  const router = useRouter();
  const { appointmentData } = useSelector((state) => state.requestUpgrade);

  const columns: TableColumnsType<DataType> = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Customer",
      dataIndex: "appointedCustomer",
      key: "appointedCustomer",
    },
    {
      title: "Date Appointed",
      dataIndex: "dateAppointed",
      key: "dateAppointed",
    },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Date CheckedIn",
      dataIndex: "dateCheckedIn",
      key: "dateCheckedIn",
    },
    {
      title: "Date CheckedOut",
      dataIndex: "dateCheckedOut",
      key: "dateCheckedOut",
    },
    { title: "Reason", dataIndex: "reason", key: "reason" },
    { title: "Note", dataIndex: "note", key: "note" },
    { title: "Date Created", dataIndex: "dateCreated", key: "dateCreated" },
    { title: "Date Updated", dataIndex: "dateUpdated", key: "dateUpdated" },
    // {
    //   title: "Action",
    //   key: "operation",
    //   render: (record: Appointment) => (
    //     <Space wrap>
    //       <Tooltip title="Edit" color={"black"}>
    //         <Button onClick={() => onEdit(record)}>
    //           <BiEdit />
    //         </Button>
    //       </Tooltip>
    //       <Tooltip title="Delete" color={"black"}>
    //         <Button onClick={() => onDelete(record)}>
    //           <AiFillDelete />
    //         </Button>
    //       </Tooltip>
    //     </Space>
    //   ),
    // },
  ];

  const data: DataType[] = [];
  for (let i = 0; i < appointmentData?.data?.length; ++i) {
    data.push({
      key: appointmentData?.data[i].id,
      id: appointmentData?.data[i].id,
      appointedCustomer: appointmentData?.data[i].appointedCustomer,
      dateAppointed: moment(appointmentData?.data[i].dateAppointed).format(
        dateAdvFormat
      ),
      dateCheckedIn: moment(appointmentData?.data[i].dateCheckedIn).format(
        dateAdvFormat
      ),
      dateCheckedOut: moment(appointmentData?.data[i].dateCheckedOut).format(
        dateAdvFormat
      ),
      status: appointmentData?.data[i].status,
      reason: appointmentData?.data[i].reason,
      note: appointmentData?.data[i].note,
      techNote: appointmentData?.data[i].techNote,
      isCorrectPerson: appointmentData?.data[i].isCorrectPerson,
      dateCreated: moment(appointmentData?.data[i].dateCreated).format(
        dateAdvFormat
      ),
      dateUpdated: moment(appointmentData?.data[i].dateUpdated).format(
        dateAdvFormat
      ),
    });
  }

  return (
    <>
      <Divider orientation="left" plain>
        <h3>Appointment</h3>
      </Divider>
      <Table
        columns={columns}
        dataSource={data}
        scroll={{ x: 1300 }}
        pagination={false}
        className="cursor-pointer"
      />
    </>
  );
};

export default AppointmentTable;
