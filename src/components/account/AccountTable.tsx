"use client";
import React from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";

interface DataType {
  key: React.Key;
  name: string;
  id: number;
  address: string;
}

const columnAccountTable: ColumnsType<DataType> = [
  {
    title: "ID",
    width: 30,
    dataIndex: "id",
    key: "id",
    fixed: "left",
  },
  {
    title: "Tên",
    width: 100,
    dataIndex: "name",
    key: "name",
    fixed: "left",
  },
  {
    title: "Công ty",
    dataIndex: "address",
    key: "1",
    width: 150,
  },
  {
    title: "Email",
    dataIndex: "address",
    key: "2",
    width: 150,
  },
  {
    title: "Tên đăng nhập",
    dataIndex: "address",
    key: "3",
    width: 150,
  },

  {
    title: "Tuỳ chọn",
    key: "operation",
    fixed: "right",
    width: 100,
    render: () => <a>action</a>,
  },
];

const data: DataType[] = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    name: `Edward ${i}`,
    id: i,
    address: `London Park no. ${i}`,
  });
}

const AccountTable: React.FC = () => (
  <Table columns={columnAccountTable} dataSource={data} scroll={{ x: 1500 }} />
);

export default AccountTable;
