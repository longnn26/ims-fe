"use client";

import React from "react";
import {
  Button,
  Space,
  Table,
  Tooltip,
  Divider,
  Tag,
  TableColumnsType,
} from "antd";
import { BiEdit, BiSolidCommentDetail } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import moment from "moment";
import { Descriptions, RequestUpgrade } from "@models/requestUpgrade";
import { ComponentObj } from "@models/component";
import {
  ROLE_TECH,
  dateAdvFormat,
  requestUpgradeStatus,
} from "@utils/constants";
import useSelector from "@hooks/use-selector";
import { useRouter } from "next/router";
import requestUpgrade from "@services/requestUpgrade";
import { areInArray } from "@utils/helpers";
import { useSession } from "next-auth/react";

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
  component: ComponentObj;
  requestType: string;
  description: string;
  serverAllocationId: number;
  componentId: number;
  status: string;
  dateCreated: string;
  dateUpdated: string;
}

const RequestUpgradeTable: React.FC<Props> = (props) => {
  const { onEdit, onDelete, urlOncell, typeGet } = props;
  const router = useRouter();
  const { data: session } = useSession();

  const { requestUpgradeDataLoading, requestUpgradeData } = useSelector(
    (state) => state.requestUpgrade
  );
  const { requestUpgradeData: rUDataOfAppointment } = useSelector(
    (state) => state.appointment
  );

  var listData =
    typeGet == "All"
      ? requestUpgradeData
      : typeGet == "ByAppointmentId"
      ? rUDataOfAppointment
      : requestUpgradeData;

  const columns: TableColumnsType<DataType> = [
    {
      title: "No",
      dataIndex: "id",
      key: "id",
      fixed: "left",
      render: (text) => (
        <p className="text-[#b75c3c] hover:text-[#ee4623]">{text}</p>
      ),
    },
    {
      title: "Component",
      key: "component",
      render: (record: RequestUpgrade) => <p>{`${record.component?.name}`}</p>,
    },
    {
      title: "Type",
      key: "requestType",
      dataIndex: "requestType",
    },
    {
      title: "Status",
      // dataIndex: "status",
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
    { title: "Date Created", dataIndex: "dateCreated", key: "dateCreated" },
    { title: "Date Updated", dataIndex: "dateUpdated", key: "dateUpdated" },
    {
      title: "Action",
      key: "operation",
      render: (record: RequestUpgrade) => (
        <Space wrap>
          <Tooltip title="View detail" color={"black"}>
            <Button
              onClick={() =>
                router.push(`${urlOncell}/requestUpgrade/${record.id}`)
              }
            >
              <BiSolidCommentDetail />
            </Button>
          </Tooltip>
          {Boolean(
            record.status !== "Success" &&
              record.status !== "Failed" &&
              record.status !== "Denied" &&
              areInArray(session?.user.roles!, ROLE_TECH)
          ) && (
            <>
              <Tooltip title="Edit" color={"black"}>
                <Button onClick={() => onEdit(record)}>
                  <BiEdit />
                </Button>
              </Tooltip>
              <Tooltip title="Delete" color={"black"}>
                <Button onClick={() => onDelete(record)}>
                  <AiFillDelete />
                </Button>
              </Tooltip>
            </>
          )}
        </Space>
      ),
    },
  ];

  const data: DataType[] = [];
  for (let i = 0; i < listData?.data?.length; ++i) {
    data.push({
      key: listData?.data[i].id,
      id: listData?.data[i].id,
      component: listData?.data[i].component,
      requestType: listData?.data[i].requestType,
      serverAllocationId: listData?.data[i].serverAllocationId,
      componentId: listData?.data[i].componentId,
      status: listData?.data[i].status,
      description: listData?.data[i].description,
      dateCreated: moment(listData?.data[i].dateCreated).format(dateAdvFormat),
      dateUpdated: moment(listData?.data[i].dateUpdated).format(dateAdvFormat),
    });
  }

  return (
    <div className="shadow m-5">
      <Divider orientation="left" plain>
        <h3>Request Upgrade</h3>
      </Divider>
      <Table
        loading={requestUpgradeDataLoading}
        columns={columns}
        dataSource={data}
        scroll={{ x: 1300 }}
        pagination={false}
        className="cursor-pointer"
      />
    </div>
  );
};

export default RequestUpgradeTable;
