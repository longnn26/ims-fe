"use client";

import useSelector from "@hooks/use-selector";
import { dateAdvFormat } from "@utils/constants";
import { Divider, TableColumnsType } from "antd";
import { Button, Space, Table, Tooltip } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import moment from "moment";
import { ServerHardwareConfig } from "@models/serverHardwareConfig";

interface Props {
  onEdit: (data: ServerHardwareConfig) => void;
  onDelete: (data: ServerHardwareConfig) => void;
}

interface DataType {
  key: React.Key;
  id: number;
  description: string;
  capacity: number;
  serverAllocationId: number;
  componentId: number;
  dateCreated: string;
  dateUpdated: string;
}

const ServerHardwareConfigTable: React.FC<Props> = (props) => {
  const { onEdit, onDelete } = props;
  const { serverHardwareConfigDataLoading, serverHardwareConfigData } =
    useSelector((state) => state.serverHardwareConfig);

  const columns: TableColumnsType<DataType> = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Capacity", dataIndex: "capacity", key: "capacity" },
    { title: "Date Created", dataIndex: "dateCreated", key: "dateCreated" },
    { title: "Date Updated", dataIndex: "dateUpdated", key: "dateUpdated" },
    {
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
    },
  ];

  const data: DataType[] = [];
  for (let i = 0; i < serverHardwareConfigData?.data?.length; ++i) {
    data.push({
      key: serverHardwareConfigData?.data[i].id,
      id: serverHardwareConfigData?.data[i].id,
      description: serverHardwareConfigData?.data[i].description,
      capacity: serverHardwareConfigData?.data[i].capacity,
      serverAllocationId: serverHardwareConfigData?.data[i].serverAllocationId,
      componentId: serverHardwareConfigData?.data[i].componentId,
      dateCreated: moment(serverHardwareConfigData?.data[i].dateCreated).format(
        dateAdvFormat
      ),
      dateUpdated: moment(serverHardwareConfigData?.data[i].dateUpdated).format(
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
