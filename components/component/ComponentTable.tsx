"use client";

import useSelector from "@hooks/use-selector";
import { dateAdvFormat } from "@utils/constants";
import { TableColumnsType } from "antd";
import { Button, Space, Table, Tooltip } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import moment from "moment";
import { ComponentObj } from "@models/component";
import { useRouter } from "next/router";

interface Props {
  onEdit: (data: ComponentObj) => void;
  onDelete: (data: ComponentObj) => void;
}

interface DataType {
  key: React.Key;
  id: number;
  unit: string;
  name: string;
  description: string;
  type: string;
  dateCreated: string;
  dateUpdated: string;
}

const ComponentTable: React.FC<Props> = (props) => {
  const { onEdit, onDelete } = props;
  const router = useRouter();
  const { componentDataLoading, componentData } = useSelector(
    (state) => state.component
  );

  const columns: TableColumnsType<DataType> = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      fixed: "left",
      render: (text) => (
        <a className="text-[#b75c3c] hover:text-[#ee4623]">{text}</a>
      ),
      onCell: (record, rowIndex) => {
        return {
          onClick: (ev) => {
            router.push(`/server/${record.id}/detail`);
          },
        };
      },
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Unit", dataIndex: "unit", key: "unit" },
    { title: "Type", dataIndex: "type", key: "type" },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    { title: "Date Created", dataIndex: "dateCreated", key: "dateCreated" },
    { title: "Date Updated", dataIndex: "dateUpdated", key: "dateUpdated" },
    {
      title: "Action",
      key: "operation",
      render: (record: ComponentObj) => (
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
  for (let i = 0; i < componentData?.data?.length; ++i) {
    data.push({
      key: componentData?.data[i].id,
      id: componentData?.data[i].id,
      name: componentData?.data[i].name,
      description: componentData?.data[i].description,
      unit: componentData?.data[i].unit,
      type: componentData?.data[i].type,
      dateCreated: moment(componentData?.data[i].dateCreated).format(
        dateAdvFormat
      ),
      dateUpdated: moment(componentData?.data[i].dateUpdated).format(
        dateAdvFormat
      ),
    });
  }

  return (
    <>
      <Table
        loading={componentDataLoading}
        columns={columns}
        dataSource={data}
        scroll={{ x: 1300 }}
        pagination={false}
      />
    </>
  );
};

export default ComponentTable;
