"use client";

import useSelector from "@hooks/use-selector";
import { dateAdvFormat } from "@utils/constants";
import { Avatar, TableColumnsType } from "antd";
import { Button, Space, Table, Tooltip } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import moment from "moment";
import { Language } from "@models/language";
import { url } from "@utils/api-links";

interface Props {
  onEdit: (data: Language) => void;
  onDelete: (data: Language) => void;
}

interface DataType {
  key: React.Key;
  id: string;
  name: string;
  description: string;
  dateCreated: string;
  image: string;
  status: string;
  parentFolder: string;
}

const BlogTable: React.FC<Props> = (props) => {
  const { onEdit, onDelete } = props;
  const { languageDataLoading, languageData } = useSelector(
    (state) => state.language
  );

  const columns: TableColumnsType<DataType> = [
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Image",
      key: "image",
      render: (record: Language) =>
        record.image && (
          <Avatar
            src={
              <img
                src={`${url}/${record.parentFolder}/${record?.image}`}
                alt="image"
              />
            }
          />
        ),
    },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "Date Created", dataIndex: "dateCreated", key: "dateCreated" },
    {
      title: "Action",
      key: "operation",
      render: (record: Language) => (
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
  for (let i = 0; i < languageData?.data?.length; ++i) {
    data.push({
      key: languageData?.data[i].id,
      id: languageData?.data[i].id,
      name: languageData?.data[i].name,
      description: languageData?.data[i].description,
      image: languageData?.data[i].image,
      parentFolder: languageData?.data[i].parentFolder,
      status: languageData?.data[i].status,
      dateCreated: moment(languageData?.data[i].dateCreated).format(
        dateAdvFormat
      ),
    });
  }

  return (
    <>
      <Table
        loading={languageDataLoading}
        columns={columns}
        dataSource={data}
        scroll={{ x: 1300 }}
        pagination={false}
      />
    </>
  );
};

export default BlogTable;
