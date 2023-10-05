"use client";
import React, { useState } from "react";
import { Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import EditCustomerModal from "./EditCustomerModal";

interface DataType {
  key: string;
  name: string;
  representative: string;
  address: string;
  phone: string;
  email: string;
}

const CustomerListTable: React.FC = () => {
  const [open, setOpen] = useState(false);

  const showEditCustomerModal = () => {
    setOpen(true);
  };

  const onCreate = (values: any) => {
    console.log("Received values of form: ", values);
    setOpen(false);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Tên công ty",
      dataIndex: "name",
      key: "name",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Người đại diện",
      dataIndex: "representative",
      key: "representative",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Điện thoại",
      key: "phone",
      dataIndex: "phone",
    },
    {
      title: "Email",
      key: "email",
      dataIndex: "email",
    },
    {
      title: "Tùy Chọn",
      key: "action",
      render: () => (
        <Space size="middle">
          <a>Chi tiết </a>
          <a onClick={() => showEditCustomerModal()}>Chỉnh sửa </a>
          <a>Xóa</a>
        </Space>
      ),
    },
  ];

  const data: DataType[] = [
    {
      key: "1",
      name: "Hisoft",
      representative: "Trần Anh Tuấn",
      address: "New York No. 1 Lake Park",
      phone: "0913740946",
      email: "tuantase151156@fpt.edu.vn",
    },
    {
      key: "2",
      name: "Hisoft",
      representative: "Trần Cao Vỹ",
      address: "London No. 1 Lake Park",
      phone: "0913740946",
      email: "tuantase151156@fpt.edu.vn",
    },
    {
      key: "3",
      name: "Hisoft",
      representative: "Phạm Nhật Hạ",
      address: "Sydney No. 1 Lake Park",
      phone: "0913740946",
      email: "tuantase151156@fpt.edu.vn",
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={data} />
      <EditCustomerModal
        open={open}
        onCreate={onCreate}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </>
  );
};

export default CustomerListTable;
