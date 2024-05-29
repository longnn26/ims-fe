"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { Button, Dropdown, Modal, Space } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { IoMdPersonAdd } from "react-icons/io";
import { GrTransaction } from "react-icons/gr";
import { BiCheck, BiDetail } from "react-icons/bi";
import { Table } from "antd";
import type { MenuProps, TableColumnsType, TableProps } from "antd";
import { EmergencyType, EmergencyListData } from "@models/emergency";
import emergencyService from "@services/emergency";
import { ParamGet } from "@models/base";
import { useSession } from "next-auth/react";
import { formatDate, getColorByStatus } from "@utils/helpers";
import {
  EmergencyStatusEnum,
  EmergencyTypeEnum,
  SupportStatusEnum,
  SupportTypeModelEnum,
} from "@utils/enum";
import StatusCell from "@components/table/StatusCell";

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});
const { confirm } = Modal;

type OnChange = NonNullable<TableProps<EmergencyType>["onChange"]>;
type Filters = Parameters<OnChange>[1];

type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

const columns: TableColumnsType<EmergencyType> = [
  {
    title: "Người gửi",
    dataIndex: "sender",
    render: (text: any, record: EmergencyType) => record.sender.name,
    sorter: (a: EmergencyType, b: EmergencyType) =>
      a.sender.name.localeCompare(b.sender.name),
  },
  {
    title: "Số điện thoại",
    dataIndex: "sender",
    render: (text: any, record: EmergencyType) =>
      record.sender.phoneNumber || "(Chưa cập nhập)",
    sorter: (a: EmergencyType, b: EmergencyType) => {
      const phoneA = a.sender.phoneNumber || "";
      const phoneB = b.sender.phoneNumber || "";
      return phoneA.localeCompare(phoneB);
    },
  },
  {
    title: "Mã chuyến đi",
    dataIndex: "booking",
    render: (text: any, record: EmergencyType) =>
      record.booking.id || "(Chưa cập nhập)",
    sorter: (a: EmergencyType, b: EmergencyType) => {
      const bookingA = a.booking.id || "";
      const bookingB = b.booking.id || "";
      return bookingA.localeCompare(bookingB);
    },
  },
  {
    title: "Người xử lý",
    dataIndex: "handler",
    render: (text: any, record: EmergencyType) => record.handler.name,
    sorter: (a: EmergencyType, b: EmergencyType) => {
      const nameA = a.handler.name || "";
      const nameB = b.handler.name || "";
      return nameA.localeCompare(nameB);
    },
  },
  {
    title: "Loại khẩn cấp",
    dataIndex: "emergencyType",
    filters: [
      {
        text: EmergencyTypeEnum.Call,
        value: EmergencyTypeEnum.Call,
      },
      {
        text: EmergencyTypeEnum.Chat,
        value: EmergencyTypeEnum.Chat,
      },
      {
        text: EmergencyTypeEnum.Police,
        value: EmergencyTypeEnum.Police,
      },
    ],
    onFilter: (value, record) =>
      (record.emergencyType || "").startsWith(value as string),
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    filters: [
      {
        text: EmergencyStatusEnum.Pending,
        value: EmergencyStatusEnum.Pending,
      },
      {
        text: EmergencyStatusEnum.Processing,
        value: EmergencyStatusEnum.Processing,
      },
      {
        text: EmergencyStatusEnum.Solved,
        value: EmergencyStatusEnum.Solved,
      },
    ],
    onFilter: (value, record) =>
      (record.status || "").startsWith(value as string),
    render: (text: string) => <StatusCell status={text} />,
  },
  {
    title: "Ngày khởi tạo",
    dataIndex: "",
  },
  {
    title: "",
    dataIndex: "",
    key: "x",
    render: () => (
      <Dropdown menu={{ items }} trigger={["click"]}>
        <a onClick={(e) => e.preventDefault()}>
          <EllipsisOutlined style={{ fontSize: "20px" }} />
        </a>
      </Dropdown>
    ),
  },
];

const items: MenuProps["items"] = [
  {
    key: "1",
    label: <p>Chi tiết</p>,
    icon: <BiDetail />,
  },
  {
    key: "2",
    label: <p>Tạo tài khoản</p>,
    icon: <IoMdPersonAdd />,
  },
  {
    key: "3",
    label: <p>Đang tiến hành</p>,
    icon: <GrTransaction />,
  },
  {
    key: "4",
    label: <p>Đánh dấu đã giải quyết</p>,
    icon: <GrTransaction />,
  },
  {
    key: "5",
    label: <p>Đánh dấu không thể giải quyết</p>,
    icon: <GrTransaction />,
  },
  {
    key: "6",
    label: <p>Đánh dấu đã giải quyết</p>,
    icon: <BiCheck />,
  },
  // {
  //   key: "2",
  //   danger: true,
  //   label: "a danger item",
  // },
];

const Emergency: React.FC = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [emergencyListData, setEmergencyListData] = useState<EmergencyType[]>();
  const [tablePagination, setTablePagination] = useState<EmergencyListData>({
    pageIndex: 1,
    pageSize: 10,
    pageSkip: 0,
    totalPage: 3,
    totalSize: 20,
  });
  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});

  const getEmergencyListData = async () => {
    console.log("session?.user", session?.user)
    setLoading(true);
    await emergencyService
      .getAllEmergency(session?.user.access_token!, {
        pageSize: tablePagination.pageSize,
        pageIndex: tablePagination.pageIndex,
      } as ParamGet)
      .then((res) => {
        console.log("res", res.data);
        setTablePagination({
          ...tablePagination,
          pageSize: res.pageSize,
          totalPage: res.totalPage,
          totalSize: res.totalSize,
        });

        setEmergencyListData(res.data);
        setLoading(false);
      })
      .catch((errors) => {
        console.log("errors get emergency", errors);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
  };

  const onChangeTable: TableProps<EmergencyType>["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    setTablePagination({
      ...tablePagination,
      pageIndex: pagination.current ?? 1,
      pageSize: pagination.pageSize ?? 10,
      totalPage: pagination.total ?? 0,
    });
    setFilteredInfo(filters);
    setSortedInfo(sorter as Sorts);
  };

  useEffect(() => {
    session && getEmergencyListData();
  }, [session, tablePagination?.pageIndex, tablePagination?.pageSize]);

  return (
    <AntdLayoutNoSSR
      content={
        <>
          <div className="mb-4 bg-[#f8f9fa]/10 border border-gray-200 rounded-lg shadow-lg shadow-[#e7edf5]/50">
            <div className="flex w-full justify-end">
              <Space style={{ margin: "16px" }}>
                <Button onClick={clearAll}>Clear </Button>
              </Space>
            </div>

            <Table
              columns={columns}
              dataSource={emergencyListData}
              onChange={onChangeTable}
              loading={loading}
              pagination={{
                pageSize: tablePagination.pageSize,
                total: tablePagination.totalSize,
              }}
            />
          </div>
        </>
      }
    />
  );
};

export default Emergency;
