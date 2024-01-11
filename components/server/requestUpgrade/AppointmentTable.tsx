"use client";

import useSelector from "@hooks/use-selector";
import useDispatch from "@hooks/use-dispatch";
import { Appointment, AppointmentData, ParamGetExtend } from "@models/appointment";
import { ROLE_CUSTOMER, dateAdvFormat, requestUpgradeStatus } from "@utils/constants";
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
import { BiSolidCommentDetail, BiEdit } from "react-icons/bi";
import { getAppointmentData } from "@slices/incident";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { getListAppointment } from "@slices/appointment";
import { areInArray } from "@utils/helpers";

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
  //isCorrectPerson: boolean;
  status: string;
  dateCreated: string;
  dateUpdated: string;
  name: string;
  companyName: string;
}

const AppointmentTable: React.FC<Props> = (props) => {
  const { onEdit, onDelete, typeGet, urlOncell } = props;
  const { data: session } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();
  const { appointmentData } = useSelector((state) => state.requestUpgrade);
  const { appointmentData: appointmentDataRE } = useSelector((state) => state.requestExpand);

  const { appointmentData: appointmentIncident } = useSelector((state) => state.incident);
  const { listAppointmentData } = useSelector((state) => state.appointment);

  dispatch(getAppointmentData({
    token: session?.user.access_token!,
    paramGet: {
      IncidentId: parseInt(router.query.incidentId + ""),
    } as ParamGetExtend
  }));

  var listData = typeGet === "All" ? listAppointmentData
    : typeGet === "ByRequestUpgradeId" ? appointmentData
      : typeGet === "ByRequestExpandId" ? appointmentDataRE
        : typeGet === "ByIncidentId" ? appointmentIncident
          : listAppointmentData;

  const columns: TableColumnsType<DataType> = [
    {
      title: "Date Appointed",
      dataIndex: "dateAppointed",
      key: "dateAppointed",
    },
    {
      title: "Customer",
      dataIndex: "companyName",
      key: "companyName",
    },
    {
      title: "Server Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Visiter",
      dataIndex: "appointedCustomer",
      key: "appointedCustomer",
      render: (appointedCustomer) => (
        <>
          {appointedCustomer.split(',').map((visitor, index) => (
            <>
              {index > 0 && <br />}
              {visitor}
            </>
          ))}
        </>
      ),
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
          {(record.status === "Waiting" || record.status === "Accepted") &&
            areInArray(session?.user.roles!, ROLE_CUSTOMER) && (
            <Tooltip title="Edit" color={"black"}>
              <Button onClick={() => onEdit(record)}>
                <BiEdit />
              </Button>
            </Tooltip>
          )}
        </Space>
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
      //isCorrectPerson: listData?.data[i].isCorrectPerson,
      dateCreated: moment(listData?.data[i].dateCreated).format(dateAdvFormat),
      dateUpdated: moment(listData?.data[i].dateUpdated).format(dateAdvFormat),
      name: listData?.data[i].serverAllocation.name,
      companyName: listData?.data[i].customer.companyName,
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
