"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { Button, Dropdown, Menu, Modal, Space } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { Table } from "antd";
import type { TableProps } from "antd";
import { BookingType, BookingListData } from "@models/booking";
import bookingService from "@services/booking";
import { PagingModel, ParamGet } from "@models/base";
import { useSession } from "next-auth/react";
import StatusCell from "@components/table/StatusCell";
import {
  convertToVietnamTimeInBooking,
  getColorByStatusClass,
  removeHyphens,
} from "@utils/helpers";
import { items } from "@components/account/AccountConstant";
import { TypeOptions, toast } from "react-toastify";
import TextNotUpdate from "@components/table/TextNotUpdate";
import ModalAccountDetail from "@components/account/ModalAccountDetail";
import ProfileCell from "@components/table/ProfileCell";
import ModalBookingDetail from "@components/booking/ModalBookingDetail";

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});
const { confirm } = Modal;
const { Column } = Table;

type OnChange = NonNullable<TableProps<BookingType>["onChange"]>;
type Filters = Parameters<OnChange>[1];

type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

const Booking: React.FC = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [bookingListData, setBookingListData] = useState<BookingType[]>([]);
  const [tablePagination, setTablePagination] = useState<PagingModel>({
    pageIndex: 1,
    pageSize: 10,
    pageSkip: 0,
    totalPage: 0,
    totalSize: 0,
  });
  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});

  const [selectedBooking, setSelectedBooking] = useState<BookingType | null>(
    null
  );

  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  //quản lý các state cho action
  const [openModalAccountDetail, setOpenModalAccountDetail] =
    useState<boolean>(false);

  const getBookingListData = async () => {
    setLoading(true);
    await bookingService
      .getAllBookingByAdmin(session?.user.access_token!, {
        pageSize: tablePagination.pageSize,
        pageIndex: tablePagination.pageIndex,
      } as ParamGet)
      .then((res: BookingListData) => {
        setTablePagination({
          ...tablePagination,
          pageSize: res.pageSize,
          totalPage: res.totalPage,
          totalSize: res.totalSize,
        });

        setBookingListData(res.data);

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

  const onChangeTable: TableProps<BookingType>["onChange"] = (
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
    console.log("filters: ", filters);

    setSortedInfo(sorter as Sorts);
  };

  //xử lý khi click vào item trong list action
  const createMenu = (record: BookingType) => {
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

  const handleMenuClick = async (key: string, record: BookingType) => {
    setSelectedBooking(record);
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
    session && getBookingListData();
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
              dataSource={bookingListData}
              onChange={onChangeTable}
              loading={loading}
              pagination={{
                pageSize: tablePagination.pageSize,
                total: tablePagination.totalSize,
              }}
            >
              <Column
                title="Mã chuyến đi"
                dataIndex="id"
                key="id"
                render={(text, record: BookingType) =>
                  removeHyphens(record?.id)
                }
              />
              <Column
                title="Khách hàng"
                dataIndex="customer"
                key="customerName"
                render={(text, record: BookingType) => (
                  <ProfileCell user={record.searchRequest?.customer} />
                )}
                sorter={(a: BookingType, b: BookingType) =>
                  a.customer.name.localeCompare(b.customer.name)
                }
              />
              <Column
                title="Tài xế"
                dataIndex="driver"
                key="driverName"
                render={(text, record: BookingType) => (
                  <ProfileCell user={record.driver} />
                )}
                sorter={(a: BookingType, b: BookingType) =>
                  a.driver.name.localeCompare(b.driver.name)
                }
              />
              <Column
                title="Nơi đặt"
                dataIndex="pickupAddress"
                key="pickupAddress"
                render={(text, record: BookingType) => (
                  <p>{record?.searchRequest?.pickupAddress}</p>
                )}
                width={"20%"}
              />
              <Column
                title="Thời gian đặt"
                dataIndex="dateCreated"
                key="dateCreated"
                render={(text, record: BookingType) => (
                  <p>{convertToVietnamTimeInBooking(record?.dateCreated)}</p>
                )}
              />
              <Column
                title="Nơi trả khách"
                dataIndex="dropOffAddress"
                key="dropOffAddress"
                render={(text, record: BookingType) => (
                  <p>{record?.searchRequest?.dropOffAddress}</p>
                )}
                width={"20%"}
              />
              <Column
                title="Trạng thái"
                dataIndex="status"
                key="status"
                sorter={(a: BookingType, b: BookingType) =>
                  a.status.localeCompare(b.status)
                }
                render={(text) => <StatusCell status={text} />}
              />

              <Column
                title="Hành động"
                dataIndex=""
                key="action"
                render={(text, record: BookingType) => (
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

          {selectedBooking && (
            <ModalBookingDetail
              open={openModalAccountDetail}
              dataBooking={selectedBooking}
              onClose={() => setOpenModalAccountDetail(false)}
            />
          )}
        </>
      }
    />
  );
};

export default Booking;
