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
import { dateAdvFormat, requestUpgradeStatus } from "@utils/constants";
import useSelector from "@hooks/use-selector";
import { useRouter } from "next/router";

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
  serialNumber: Descriptions[];
  model: Descriptions[];
  capacity: Descriptions[];
  description: Descriptions[];
  serverAllocationId: number;
  componentId: number;
  status: string;
  dateCreated: string;
  dateUpdated: string;
}

const RequestUpgradeTable: React.FC<Props> = (props) => {
  const { onEdit, onDelete, urlOncell, typeGet } = props;
  const router = useRouter();

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
        </Space>
      ),
    },
  ];

  const getStatusColor = (status: string) => {
    // Define your color mapping logic here based on different statuses
    // For example, assuming "Pending", "Approved", "Rejected"
    switch (status) {
      case "Pending":
        return "orange";
      case "Approved":
        return "green";
      case "Rejected":
        return "red";
      default:
        return "defaultColor"; // Set a default color or handle other cases
    }
  };

  const expandedRowRender = (record: DataType) => {
    const nestedColumns = [
      {
        title: "Serial Number",
        dataIndex: "serialNumber",
        key: "serialNumber",
      },
      {
        title: "Model",
        dataIndex: "model",
        key: "model",
      },
      {
        title: "Capacity",
        dataIndex: "capacity",
        key: "capacity",
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
      },
    ];

    const nestedData = record.serialNumber.map((des, index) => ({
      key: index,
      serialNumber: record.serialNumber[index].serialNumber,
      model: record.model[index].model,
      capacity: record.capacity[index].capacity,
      description: record.description[index].description,
    }));

    return (
      <Table
        columns={nestedColumns}
        dataSource={nestedData}
        pagination={false}
      />
    );
  };

  const data: DataType[] = [];
  for (let i = 0; i < listData?.data?.length; ++i) {
    data.push({
      key: listData?.data[i].id,
      id: listData?.data[i].id,
      component: listData?.data[i].component,
      serverAllocationId: listData?.data[i].serverAllocationId,
      componentId: listData?.data[i].componentId,
      status: listData?.data[i].status,
      serialNumber: listData?.data[i].descriptions,
      model: listData?.data[i].descriptions,
      capacity: listData?.data[i].descriptions,
      description: listData?.data[i].descriptions,
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
        expandable={{ expandedRowRender }}
        scroll={{ x: 1300 }}
        pagination={false}
        className="cursor-pointer"
      />
    </div>
  );
};

export default RequestUpgradeTable;
