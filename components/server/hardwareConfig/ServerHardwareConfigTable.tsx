"use client";

import React from "react";
import { Button, Space, Table, Tooltip, Divider, TableColumnsType } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import moment from "moment";
import {
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
  dateCreated: string;
}

const ServerHardwareConfigTable: React.FC<Props> = (props) => {
  const { onEdit, onDelete, serverStatus } = props;
  const { data: session } = useSession();

  const { serverHardwareConfigDataLoading, serverHardwareConfigData } =
    useSelector((state) => state.serverHardwareConfig);

  const columns: TableColumnsType<DataType> = [
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

  const data: DataType[] = [];
  for (let i = 0; i < serverHardwareConfigData?.data?.length; ++i) {
    data.push({
      key: serverHardwareConfigData?.data[i].id,
      id: serverHardwareConfigData?.data[i].id,
      component: serverHardwareConfigData?.data[i].component,
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
        scroll={{ x: 1300 }}
        pagination={false}
        loading={serverHardwareConfigDataLoading} // Thêm dòng này
        className="cursor-pointer"
      />
    </div>
  );
};

export default ServerHardwareConfigTable;
