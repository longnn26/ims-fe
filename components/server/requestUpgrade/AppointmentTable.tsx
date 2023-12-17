"use client";

import useSelector from "@hooks/use-selector";
import { Appointment } from "@models/appointment";
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
import { BiSolidCommentDetail } from "react-icons/bi";

interface Props {
  typeGet?: string;
  urlOncell?: string;
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
  purpose: string;
}

const AppointmentTable: React.FC<Props> = (props) => {
  const { onEdit, onDelete, typeGet, urlOncell } = props;
  const router = useRouter();
  const { appointmentData } = useSelector((state) => state.requestUpgrade);
  const { appointmentData: appointmentDataRE } = useSelector(
    (state) => state.requestExpand
  );
  const { listAppointmentData } = useSelector((state) => state.appointment);

  var listData =
    typeGet == "All"
      ? listAppointmentData
      : typeGet == "ByRequestUpgradeId"
      ? appointmentData
      : typeGet == "ByRequestExpandId"
      ? appointmentDataRE
      : listAppointmentData;

  const columns: TableColumnsType<DataType> = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      fixed: "left",
      render: (text) => (
        <a className="text-[#b75c3c] hover:text-[#ee4623]">{text}</a>
      ),
    },
    {
      title: "Date Appointed",
      dataIndex: "dateAppointed",
      key: "dateAppointed",
    },
    {
      title: "Purpose",
      dataIndex: "purpose",
      key: "purpose",
    },
    {
      title: "Visiter",
      dataIndex: "appointedCustomer",
      key: "appointedCustomer",
    },
    { title: "Reason", dataIndex: "reason", key: "reason" },
    {
      title: "Status",
      // dataIndex: "status",
      key: "status",
      render: (record: Appointment) => {
        var statusData = requestUpgradeStatus.find(
          (_) => _.value === record.status
        );
        return (
          <Tag className="w-3/4 text-center" color={statusData?.color}>
            {statusData?.value}
          </Tag>
        );
      },
    },
    { title: "Note", dataIndex: "note", key: "note" },
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
    { title: "Date Created", dataIndex: "dateCreated", key: "dateCreated" },
    { title: "Date Updated", dataIndex: "dateUpdated", key: "dateUpdated" },
    {
      title: "Action",
      key: "operation",
      render: (record: Appointment) => (
        <Space wrap>
          <Tooltip title="View detail" color={"black"}>
            <Button
              onClick={() =>
                router.push(`${urlOncell}/appointment/${record.id}`)
              }
            >
              <BiSolidCommentDetail />
            </Button>
          </Tooltip>
        </Space>
        // <Space wrap>
        //   <Tooltip title="Edit" color={"black"}>
        //     <Button onClick={() => onEdit(record)}>
        //       <BiEdit />
        //     </Button>
        //   </Tooltip>
        //   <Tooltip title="Delete" color={"black"}>
        //     <Button onClick={() => onDelete(record)}>
        //       <AiFillDelete />
        //     </Button>
        //   </Tooltip>
        // </Space>
      ),
    },
  ];

  const data: DataType[] = [];
  for (let i = 0; i < listData?.data?.length; ++i) {
    data.push({
      key: listData?.data[i].id,
      id: listData?.data[i].id,
      appointedCustomer: listData?.data[i].appointedCustomer,
      dateAppointed: moment(listData?.data[i].dateAppointed).format(
        dateAdvFormat
      ),
      dateCheckedIn: moment(listData?.data[i].dateCheckedIn).format(
        dateAdvFormat
      ),
      dateCheckedOut: moment(listData?.data[i].dateCheckedOut).format(
        dateAdvFormat
      ),
      status: listData?.data[i].status,
      reason: listData?.data[i].reason,
      note: listData?.data[i].note,
      techNote: listData?.data[i].techNote,
      isCorrectPerson: listData?.data[i].isCorrectPerson,
      dateCreated: moment(listData?.data[i].dateCreated).format(dateAdvFormat),
      dateUpdated: moment(listData?.data[i].dateUpdated).format(dateAdvFormat),
      purpose: listData?.data[i].purpose,
    });
  }

  return (
    <div className="shadow m-5">
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
    </div>
  );
};

export default AppointmentTable;
