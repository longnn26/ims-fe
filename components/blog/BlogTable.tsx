"use client";

import useSelector from "@hooks/use-selector";
import { Blog } from "@models/blog";
import { BlogTranslation } from "@models/blogTranslation";
import { Resource } from "@models/resource";
import { dateAdvFormat } from "@utils/constants";
import { Avatar, TableColumnsType } from "antd";
import { Badge, Button, Space, Table, Tooltip } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { AiOutlineFileAdd } from "react-icons/ai";
import moment from "moment";
import { Language } from "@models/language";
import { url } from "@utils/api-links";
import { useState } from "react";
import ModalHandleCategory from "./ModalHandleCategory";
import { MdCategory } from "react-icons/md";

interface Props {
  onEdit: (data: Blog) => void;
  onEditBlogTranslation: (data: BlogTranslation) => void;
  onDeleteBlogTranslation: (data: BlogTranslation) => void;
  onDelete: (data: Blog) => void;
}

interface DataType {
  key: React.Key;
  name: string;
  platform: string;
  version: string;
  upgradeNum: number;
  creator: string;
  createdAt: string;
  resources: Resource[];
  blogTranslationsCount: number;
  blogTranslations: BlogTranslation[];
  id: string;
}

interface ExpandedDataType {
  key: React.Key;
  title: string;
  description: string;
  content: string;
  startPublishDate: string;
  endPublishDate: string;
  status: string;
  access: string;
  id: string;
  blogId: string;
  language: Language;
  languageName: string;
  dateCreated: string;
}

const BlogTable: React.FC<Props> = (props) => {
  const { onEdit, onDelete, onEditBlogTranslation, onDeleteBlogTranslation } =
    props;
  const { blogDataLoading, blogData } = useSelector((state) => state.blog);
  const [blogId, setBlogId] = useState<string | undefined>();

  const expandedRowRender = (blogTranslations: BlogTranslation[]) => {
    const columns: TableColumnsType<ExpandedDataType> = [
      {
        title: "Language",
        key: "language",
        // fixed: 'left',
        render: (record: BlogTranslation) =>
          record?.language?.image && (
            <Avatar
              src={
                <img
                  src={`${url}/${record?.language?.parentFolder}/${record?.language?.image}`}
                  alt="image"
                />
              }
            />
          ),
      },
      {
        title: "Language Name",
        key: "languageName",
        dataIndex: "languageName",
      },
      {
        title: "Start Publish",
        dataIndex: "startPublishDate",
        key: "startPublishDate",
      },
      {
        title: "End Publish",
        dataIndex: "endPublishDate",
        key: "endPublishDate",
      },
      {
        title: "Date created",
        dataIndex: "dateCreated",
        key: "dateCreated",
      },
      {
        title: "Status",
        key: "state",
        render: (record: BlogTranslation) => (
          <Badge status="success" text={record.status} />
        ),
      },
      {
        title: "Access",
        key: "access",
        render: (record: BlogTranslation) => (
          <Badge color="volcano" text={record.access} />
        ),
      },
      {
        title: "Action",
        // dataIndex: "operation",
        key: "operation",
        render: (record: BlogTranslation) => (
          <Space wrap>
            <Tooltip title="Edit Blog Translation" color={"black"}>
              <Button onClick={() => onEditBlogTranslation(record)}>
                <BiEdit />
              </Button>
            </Tooltip>
            <Tooltip title="Delete" color={"black"}>
              <Button onClick={() => onDeleteBlogTranslation(record)}>
                <AiFillDelete />
              </Button>
            </Tooltip>
          </Space>
        ),
      },
    ];

    const data: ExpandedDataType[] = [];
    for (let i = 0; i < blogTranslations.length; ++i) {
      data.push({
        key: blogTranslations[i].id,
        id: blogTranslations[i].id,
        title: blogTranslations[i].title,
        description: blogTranslations[i].description,
        content: blogTranslations[i].content,
        startPublishDate: blogTranslations[i].startPublishDate
          ? moment(blogTranslations[i].startPublishDate).format(dateAdvFormat)
          : "",
        endPublishDate: blogTranslations[i].endPublishDate
          ? moment(blogTranslations[i].endPublishDate).format(dateAdvFormat)
          : "",
        status: blogTranslations[i].status,
        access: blogTranslations[i].access,
        blogId: blogTranslations[i].blogId,
        language: blogTranslations[i].language,
        languageName: blogTranslations[i].language.name,
        dateCreated: moment(blogTranslations[i].dateCreated).format(
          dateAdvFormat
        ),
      });
    }
    return <Table columns={columns} dataSource={data} pagination={false} />;
  };

  const columns: TableColumnsType<DataType> = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Creator", dataIndex: "creator", key: "creator" },
    { title: "Date Created", dataIndex: "createdAt", key: "createdAt" },
    {
      title: "Blog Translation",
      dataIndex: "blogTranslationsCount",
      key: "blogTranslationsCount",
    },
    {
      title: "Action",
      key: "operation",
      render: (record: Blog) => (
        // <a >Edit</a>
        <Space wrap>
          <Tooltip title="Create Blog Translation" color={"black"}>
            <Button
              onClick={() =>
                onEditBlogTranslation({ blogId: record.id } as BlogTranslation)
              }
            >
              <AiOutlineFileAdd />
            </Button>
          </Tooltip>
          <Tooltip title="Edit" color={"black"}>
            <Button onClick={() => onEdit(record)}>
              <BiEdit />
            </Button>
          </Tooltip>
          <Tooltip title="Category" color={"black"}>
            <Button onClick={() => setBlogId(record.id)}>
              <MdCategory />
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
  for (let i = 0; i < blogData?.data?.length; ++i) {
    data.push({
      key: blogData?.data[i].id,
      name: blogData.data[i].name,
      platform: "iOS",
      version: "10.3.4.5654",
      upgradeNum: 500,
      creator: blogData.data[i].user?.userName,
      createdAt: moment(blogData.data[i].dateCreated).format(dateAdvFormat),
      blogTranslationsCount: blogData.data[i].blogTranslations.length,
      blogTranslations: blogData.data[i].blogTranslations,
      resources: blogData.data[i].resources,
      id: blogData.data[i].id,
    });
  }

  return (
    <>
      <Table
        loading={blogDataLoading}
        columns={columns}
        expandable={{
          rowExpandable: (record) =>
            Boolean(record.blogTranslations.length > 0),
          expandedRowRender: (record) => {
            if (record.blogTranslations.length > 0) {
              return expandedRowRender(record.blogTranslations);
            }
            return undefined;
          },
        }}
        dataSource={data}
        scroll={{ x: 1300 }}
        pagination={false}
      />
      <ModalHandleCategory blogId={blogId!} setBlogId={setBlogId} />
    </>
  );
};

export default BlogTable;
