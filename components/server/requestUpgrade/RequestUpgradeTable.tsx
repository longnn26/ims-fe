"use client";

import useSelector from "@hooks/use-selector";
import { dateAdvFormat } from "@utils/constants";
import { Divider, TableColumnsType } from "antd";
import { Button, Space, Table, Tooltip } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import moment from "moment";
import { RequestUpgrade } from "@models/requestUpgrade";

interface Props {
  onEdit: (data: RequestUpgrade) => void;
  onDelete: (data: RequestUpgrade) => void;
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

const RequestUpgradeTable: React.FC<Props> = (props) => {
  const { onEdit, onDelete } = props;
  const { requestUpgradeDataLoading, requestUpgradeData } = useSelector(
    (state) => state.requestUpgrade
  );

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
      render: (record: RequestUpgrade) => (
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
  for (let i = 0; i < requestUpgradeData?.data?.length; ++i) {
    data.push({
      key: requestUpgradeData?.data[i].id,
      id: requestUpgradeData?.data[i].id,
      description: requestUpgradeData?.data[i].description,
      capacity: requestUpgradeData?.data[i].capacity,
      serverAllocationId: requestUpgradeData?.data[i].serverAllocationId,
      componentId: requestUpgradeData?.data[i].componentId,
      dateCreated: moment(requestUpgradeData?.data[i].dateCreated).format(
        dateAdvFormat
      ),
      dateUpdated: moment(requestUpgradeData?.data[i].dateUpdated).format(
        dateAdvFormat
      ),
    });
  }

  return (
    <>
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
    </>
  );
};

export default RequestUpgradeTable;
