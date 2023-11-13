"use client";

import useSelector from "@hooks/use-selector";
import { dateAdvFormat } from "@utils/constants";
import { TableColumnsType } from "antd";
import { Button, Space, Table, Tooltip } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import moment from "moment";
import { ServerAllocation } from "@models/serverAllocation";

interface Props {
  onEdit: (data: ServerAllocation) => void;
  onDelete: (data: ServerAllocation) => void;
}

interface DataType {
  key: React.Key;
  id: number;
  note: string;
  inspectorNote: string;
  dateCreated: string;
  status: string;
}

const ServerAllocationTable: React.FC<Props> = (props) => {
  const { onEdit, onDelete } = props;
  const { serverAllocationDataLoading, serverAllocationData } = useSelector(
    (state) => state.serverAllocation
  );

  const columns: TableColumnsType<DataType> = [
    { title: "Id", dataIndex: "id", key: "id" },
    { title: "Note", dataIndex: "note", key: "note" },
    { title: "Inspector Note", dataIndex: "inspectorNote", key: "inspectorNote" },
    { title: "Date Created", dataIndex: "dateCreated", key: "dateCreated" },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Action",
      key: "operation",
      render: (record: ServerAllocation) => (
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
  for (let i = 0; i < serverAllocationData?.data?.length; ++i) {
    data.push({
      key: serverAllocationData?.data[i].id,
      id: serverAllocationData?.data[i].id,
      note: serverAllocationData?.data[i].note,
      inspectorNote: serverAllocationData?.data[i].inspectorNote,
      status: serverAllocationData?.data[i].status,
      dateCreated: moment(serverAllocationData?.data[i].dateCreated).format(
        dateAdvFormat
      ),
    });
  }

  return (
    <>
      <Table
        loading={serverAllocationDataLoading}
        columns={columns}
        dataSource={data}
        scroll={{ x: 1300 }}
        pagination={false}
      />
    </>
  );
};

export default ServerAllocationTable;
