"use client";
import React, { useState } from "react";
import { Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import EditTicketModal from "./EditTicketModal";

interface DataType {
  key: string;
  createAt: string;
  company: string;
  request: string;
  status: string[];
}

const TicketListTable: React.FC = () => {
  const [open, setOpen] = useState(false);

  const showEditTicketModal = () => {
    setOpen(true);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Ngày tạo",
      dataIndex: "createAt",
      key: "createAt",
    },
    {
      title: "Tên công ty",
      dataIndex: "company",
      key: "company",
      render: (text) => <a>{text}</a>,
    },

    {
      title: "Loại yêu cầu",
      dataIndex: "request",
      key: "request",
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      render: (_, { status }) => (
        <>
          {status.map((stt) => {
            let color = status.length > 15 ? "geekblue" : "green";
            if (stt === "Đang Thực Hiện") {
              color = "geekblue";
            }

            if (stt === "Thành Công") {
              color = "green";
            }

            if (stt === "Thất Bại") {
              color = "volcano";
            }

            return (
              <Tag color={color} key={stt}>
                {stt.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Tùy Chọn",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a>Chi tiết </a>
          <a onClick={() => showEditTicketModal()}>Chỉnh sửa </a>
          <a>Xóa</a>
        </Space>
      ),
    },
  ];

  const data: DataType[] = [
    {
      key: "1",
      createAt: "2014-12-24 23:12:00",
      company: "HiSoft",
      request: "Thuê chỗ",
      status: ["Thành Công"],
    },
    {
      key: "2",
      createAt: "2014-12-24 23:12:00",
      company: "HiSoft",
      request: "Cấp thêm IP",
      status: ["Thất Bại"],
    },
    {
      key: "3",
      createAt: "2014-12-24 23:12:00",
      company: "HiSoft",
      request: "Cấp thêm PORT",
      status: ["Đang Thực Hiện"],
    },
  ];

  const onCreate = (values: any) => {
    console.log("Received values of form: ", values);
    setOpen(false);
  };
  return (
    <div>
      <Table columns={columns} dataSource={data} />
      <EditTicketModal
        open={open}
        onCreate={onCreate}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </div>
  );
};

export default TicketListTable;
