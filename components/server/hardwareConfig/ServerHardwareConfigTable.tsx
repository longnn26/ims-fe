"use client";

import React from "react";
import { Button, Space, Table, Tooltip, Divider, TableColumnsType } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import moment from "moment";
import {
  DescriptionsObj,
  ServerHardwareConfig,
} from "@models/serverHardwareConfig";
import { ComponentObj } from "@models/component";
import useSelector from "@hooks/use-selector";
import { ROLE_TECH, dateAdvFormat } from "@utils/constants";
import { areInArray } from "@utils/helpers";
import { useSession } from "next-auth/react";

interface Props {
  onEdit: (data: ServerHardwareConfig) => void;
  onDelete: (data: ServerHardwareConfig) => void;
  serverStatus?: string;
}

interface DataType {
  key: React.Key;
  id: number;
  component: ComponentObj;
  serialNumber: DescriptionsObj[];
  model: DescriptionsObj[];
  capacity: DescriptionsObj[];
  descriptions: DescriptionsObj[];
  dateCreated: string;
}

const ServerHardwareConfigTable: React.FC<Props> = (props) => {
  const { onEdit, onDelete, serverStatus } = props;
  const { data: session } = useSession();

  const { serverHardwareConfigDataLoading, serverHardwareConfigData } =
    useSelector((state) => state.serverHardwareConfig);

  const columns: TableColumnsType<DataType> = [
    {
      title: "No",
      dataIndex: "id",
      key: "id",
      fixed: "left",
    },
    {
      title: "Component",
      key: "component",
      render: (record: ServerHardwareConfig) => <p>{record.component?.name}</p>,
    },
    {
      title: "Date Created",
      dataIndex: "dateCreated",
      key: "dateCreated",
    },
    Boolean(
      serverStatus !== "Working" &&
        serverStatus !== "Removed" &&
        areInArray(session?.user.roles!, ROLE_TECH)
    )
      ? {
          title: "Action",
          key: "operation",
          render: (record: ServerHardwareConfig) => (
            <Space wrap>
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
        }
      : {},
  ];

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
        title: "Capacity (GB)",
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
      description: record.descriptions[index].description,
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
  for (let i = 0; i < serverHardwareConfigData?.data?.length; ++i) {
    data.push({
      key: serverHardwareConfigData?.data[i].id,
      id: serverHardwareConfigData?.data[i].id,
      component: serverHardwareConfigData?.data[i].component,
      serialNumber: serverHardwareConfigData?.data[i].descriptions,
      model: serverHardwareConfigData?.data[i].descriptions,
      capacity: serverHardwareConfigData?.data[i].descriptions,
      descriptions: serverHardwareConfigData?.data[i].descriptions,
      dateCreated: moment(serverHardwareConfigData?.data[i].dateCreated).format(
        dateAdvFormat
      ),
    });
  }

  return (
    <div className="shadow m-5">
      <Divider orientation="left" plain>
        <h3>Hardware Config</h3>
      </Divider>
      <Table
        columns={columns}
        dataSource={data}
        expandable={{ expandedRowRender }}
        scroll={{ x: 1300 }}
        pagination={false}
        loading={serverHardwareConfigDataLoading} // Thêm dòng này
        className="cursor-pointer"
      />
    </div>
  );
};

export default ServerHardwareConfigTable;
