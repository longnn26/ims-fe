"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { Button, Dropdown, Menu, Modal, Space } from "antd";
import { Table } from "antd";
import type { TableProps } from "antd";
import { TransactionType, TransactionListData } from "@models/transaction";
import requestService from "@services/request";
import { PagingModel, ParamGet } from "@models/base";
import { useSession } from "next-auth/react";
import {
  convertToVietnamTimeInBooking,
  formatCurrency,
  removeHyphens,
  translateStatusToVnLanguage,
  translateTypeToVnLanguage,
} from "@utils/helpers";
import { items } from "@components/account/AccountConstant";
import { EllipsisOutlined } from "@ant-design/icons";
import ModalRequestDetail from "@components/request/ModalRequestDetail";
import StatusCell from "@components/table/StatusCell";

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});
const { confirm } = Modal;
const { Column } = Table;

type OnChange = NonNullable<TableProps<TransactionType>["onChange"]>;
type Filters = Parameters<OnChange>[1];

type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

const Request: React.FC = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [requestListData, setRequestListData] = useState<TransactionType[]>([]);
  const [tablePagination, setTablePagination] = useState<PagingModel>({
    pageIndex: 1,
    pageSize: 10,
    pageSkip: 0,
    totalPage: 0,
    totalSize: 0,
  });
  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});

  const [selectedRequest, setSelectedRequest] =
    useState<TransactionType | null>(null);

  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  //quản lý các state cho action
  const [openModalAccountDetail, setOpenModalAccountDetail] =
    useState<boolean>(false);

  const getWalletTransactionData = async () => {
    setLoading(true);
    await requestService
      .getAllRequestWithdrawFundsByAdmin(session?.user.access_token!, {
        pageSize: tablePagination.pageSize,
        pageIndex: tablePagination.pageIndex,
      } as ParamGet)
      .then((res: TransactionListData) => {
        setTablePagination({
          ...tablePagination,
          pageSize: res.pageSize,
          totalPage: res.totalPage,
          totalSize: res.totalSize,
        });

        setRequestListData(res.data);

        setLoading(false);
      })
      .catch((errors) => {
        console.log("errors get account", errors);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
  };

  const onChangeTable: TableProps<TransactionType>["onChange"] = (
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

  //xử lý khi click vào item trong list action
  const createMenu = (record: TransactionType) => {
    // const { status } = record;

    let filteredItems;

    filteredItems = items?.filter((item) => item?.key === "1");

    return (
      <Menu onClick={({ key }) => handleMenuClick(key, record)}>
        {filteredItems?.map((item: any) => (
          <Menu.Item key={item?.key} icon={item?.icon}>
            {item?.label}
          </Menu.Item>
        ))}
      </Menu>
    );
  };

  const handleMenuClick = async (key: string, record: TransactionType) => {
    setSelectedRequest(record);
    switch (key) {
      case "1":
        setOpenModalAccountDetail(true);
        break;
      case "2":
        break;
      case "3":
        break;

      default:
        break;
    }
  };

  // use effect
  useEffect(() => {
    session && getWalletTransactionData();
  }, [session, tablePagination?.pageIndex, tablePagination?.pageSize]);

  return (
    <AntdLayoutNoSSR
      content={
        <>
          <div className="mb-4 bg-[#f8f9fa]/10 border border-gray-200 rounded-lg shadow-lg shadow-[#e7edf5]/50">
            <div className="flex w-full justify-end">
              <Space style={{ margin: "16px" }}>
                <Button onClick={clearAll}>Xóa bộ lọc </Button>
              </Space>
            </div>

            <Table
              dataSource={requestListData}
              onChange={onChangeTable}
              loading={loading}
              pagination={{
                pageSize: tablePagination.pageSize,
                total: tablePagination.totalSize,
              }}
            >
              <Column
                title="Mã giao dịch"
                dataIndex="id"
                key="id"
                render={(text, record: TransactionType) =>
                  removeHyphens(record?.id)
                }
              />
              <Column
                title="Loại giao dịch"
                dataIndex="typeWalletTransaction"
                key="typeWalletTransaction"
                render={(text, record: TransactionType) =>
                  translateTypeToVnLanguage(record.typeWalletTransaction)
                }
              />
              <Column
                title="Số tiền rút"
                dataIndex="totalMoney"
                key="totalMoney"
                render={(text, record: TransactionType) =>
                  formatCurrency(record?.totalMoney)
                }
              />

              <Column
                title="Trạng thái"
                dataIndex="status"
                key="status"
                sorter={(a: TransactionType, b: TransactionType) =>
                  a.status.localeCompare(b.status)
                }
                render={(text) => <StatusCell status={text} />}
              />
              <Column
                title="Thời gian tạo"
                dataIndex="dateCreated"
                key="dateCreated"
                sorter={(a: TransactionType, b: TransactionType) =>
                  (a?.dateCreated || "").localeCompare(b?.dateCreated || "")
                }
                render={(text, record: TransactionType) => (
                  <p>{convertToVietnamTimeInBooking(record?.dateCreated)}</p>
                )}
              />
              <Column
                title="Hành động"
                dataIndex=""
                key="action"
                render={(text, record: TransactionType) => (
                  <>
                    <Dropdown overlay={createMenu(record)} trigger={["click"]}>
                      <a onClick={(e) => e.preventDefault()}>
                        <EllipsisOutlined style={{ fontSize: "20px" }} />
                      </a>
                    </Dropdown>
                  </>
                )}
                width="100px"
                align="center"
              />
            </Table>
          </div>

          {selectedRequest && (
            <ModalRequestDetail
              open={openModalAccountDetail}
              dataRequest={selectedRequest}
              onClose={() => setOpenModalAccountDetail(false)}
              setRequestListData={setRequestListData}
            />
          )}
        </>
      }
    />
  );
};

export default Request;
