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
import { SupportType, SupportListData } from "@models/support";
import supportService from "@services/support";
import { ParamGet } from "@models/base";
import { useSession } from "next-auth/react";
import { formatDate, getColorByStatus } from "@utils/helpers";
import { SupportStatusEnum, SupportTypeModelEnum } from "@utils/enum";
import StatusCell from "@components/table/StatusCell";

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});
const { confirm } = Modal;

type OnChange = NonNullable<TableProps<SupportType>["onChange"]>;
type Filters = Parameters<OnChange>[1];

type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

const columns: TableColumnsType<SupportType> = [
  {
    title: "Fullname",
    dataIndex: "fullName",
    sorter: (a: any, b: any) => a?.fullName - b.fullName,
  },
  {
    title: "Phone number",
    dataIndex: "phoneNumber",
  },
  {
    title: "Support type",
    dataIndex: "supportType",
    filters: [
      {
        text: SupportTypeModelEnum.RECRUITMENT,
        value: SupportTypeModelEnum.RECRUITMENT,
      },
      {
        text: SupportTypeModelEnum.BOOKING_ISSUE,
        value: SupportTypeModelEnum.BOOKING_ISSUE,
      },
      {
        text: SupportTypeModelEnum.SUPPORT_ISSUE,
        value: SupportTypeModelEnum.SUPPORT_ISSUE,
      },
    ],
    sorter: (a: SupportType, b: SupportType) =>
      a?.supportType.localeCompare(b.supportType),
    onFilter: (value, record) => record.supportType.startsWith(value as string),
    // filterSearch: true,
    // width: "40%",
  },
  {
    title: "Support status",
    dataIndex: "supportStatus",
    filters: [
      {
        text: SupportStatusEnum.NEW,
        value: SupportStatusEnum.NEW,
      },
      {
        text: "In Process",
        value: SupportStatusEnum.IN_PROCESS,
      },
      {
        text: SupportStatusEnum.SOLVED,
        value: SupportStatusEnum.SOLVED,
      },
      {
        text: "Can't Solved",
        value: SupportStatusEnum.CANT_SOLVED,
      },
    ],
    onFilter: (value, record) =>
      (record.supportStatus || "").startsWith(value as string),
    render: (text: string) => <StatusCell status={text} />,
  },
  {
    title: "Date Created",
    dataIndex: "dateCreated",
    sorter: (a: SupportType, b: SupportType) =>
      (a?.dateCreated || "").localeCompare(b?.dateCreated || ""),
    render: (text: string) => formatDate(text),
  },
  {
    title: "Action",
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

const Support: React.FC = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [supportsListData, setSupportsListData] = useState<SupportType[]>();
  const [tablePagination, setTablePagination] = useState<SupportListData>({
    pageIndex: 1,
    pageSize: 10,
    pageSkip: 0,
    totalPage: 3,
    totalSize: 20,
  });
  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});

  const getSupportsListData = async () => {
    setLoading(true);
    await supportService
      .getAllSupportByAdmin(session?.user.access_token!, {
        pageSize: tablePagination.pageSize,
        pageIndex: tablePagination.pageIndex,
      } as ParamGet)
      .then((res) => {
        setTablePagination({
          ...tablePagination,
          pageSize: res.pageSize,
          totalPage: res.totalPage,
          totalSize: res.totalSize,
        });

        setSupportsListData(res.data);
      })
      .catch((errors) => {
        console.log("errors get support", errors);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
  };

  const onChangeTable: TableProps<SupportType>["onChange"] = (
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
    session && getSupportsListData();
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
              dataSource={supportsListData}
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

export default Support;
