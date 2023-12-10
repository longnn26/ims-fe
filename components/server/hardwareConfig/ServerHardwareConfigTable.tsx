"use client";

import useSelector from "@hooks/use-selector";
import { dateAdvFormat } from "@utils/constants";
import { Divider, TableColumnsType } from "antd";
import { Button, Space, Table, Tooltip } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import moment from "moment";
import {
  Descriptions,
  ServerHardwareConfig,
} from "@models/serverHardwareConfig";
import { ComponentObj } from "@models/component";

interface Props {
  onEdit: (data: ServerHardwareConfig) => void;
  onDelete: (data: ServerHardwareConfig) => void;
  serverStatus?: string;
}

interface DataType {
  key: React.Key;
  id: number;
  component: ComponentObj;
  serialNumber: Descriptions[];
  model: Descriptions[];
  capacity: Descriptions[];
  dateCreated: string;

  // information: string;
  // serverAllocationId: number;
  // componentId: number;
  // dateUpdated: string;
}

const ServerHardwareConfigTable: React.FC<Props> = (props) => {
  const { onEdit, onDelete, serverStatus } = props;
  const { serverHardwareConfigDataLoading, serverHardwareConfigData } =
    useSelector((state) => state.serverHardwareConfig);

  const columns: TableColumnsType<DataType> = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      fixed: "left",
    },
    // { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Component",
      key: "component",
      render: (record: ServerHardwareConfig) => (
        // <p>{`${record.component?.name} - ${record.component?.unit} - ${record.component?.type}`}</p>
        <p>{record.component?.name}</p>
      ),
    },
    {
      title: "Serial Number",
      dataIndex: "serialNumber",
      render: (record: Descriptions[]) =>
        record.map((des) => {
          return (
            <>
              {des.serialNumber}
              <br />
            </>
          );
        }),
    },
    {
      title: "Model",
      dataIndex: "model",
      render: (record: Descriptions[]) =>
        record.map((des) => {
          return (
            <>
              {des.model} <br />
            </>
          );
        }),
    },

    {
      title: "Capacity",
      dataIndex: "capacity",
      render: (record: Descriptions[]) =>
        record.map((des) => {
          return (
            <>
              {des.capacity} <br />
            </>
          );
        }),
    },
    { title: "Date Created", dataIndex: "dateCreated", key: "dateCreated" },
    // { title: "Date Updated", dataIndex: "dateUpdated", key: "dateUpdated" },
    Boolean(serverStatus !== "Working")
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
      serialNumber: serverHardwareConfigData?.data[i].descriptions,
      model: serverHardwareConfigData?.data[i].descriptions,
      capacity: serverHardwareConfigData?.data[i].descriptions,
      dateCreated: moment(serverHardwareConfigData?.data[i].dateCreated).format(
        dateAdvFormat
      ),

      // information: serverHardwareConfigData?.data[i].information,
      // serverAllocationId: serverHardwareConfigData?.data[i].serverAllocationId,
      // componentId: serverHardwareConfigData?.data[i].componentId,
      // dateUpdated: moment(serverHardwareConfigData?.data[i].dateUpdated).format(
      //   dateAdvFormat
      // ),
    });
  }

  return (
    <div className="shadow m-5">
      <Divider orientation="left" plain>
        <h3>Hardware Config</h3>
      </Divider>
      <Table
        loading={serverHardwareConfigDataLoading}
        columns={columns}
        dataSource={data}
        scroll={{ x: 1300 }}
        pagination={false}
        className="cursor-pointer"
      />
    </div>
  );
};

export default ServerHardwareConfigTable;
