"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { Button, Dropdown, Menu, Modal, Space } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import useDispatch from "@hooks/use-dispatch";
import { Table } from "antd";
import type { TableProps } from "antd";
import { EmergencyType, EmergencyListData } from "@models/emergency";
import emergencyService from "@services/emergency";
import { PagingModel, ParamGet } from "@models/base";
import { useSession } from "next-auth/react";
import { removeHyphens, splitString } from "@utils/helpers";
import { EmergencyStatusEnum, EmergencyTypeEnum } from "@utils/enum";
import StatusCell from "@components/table/StatusCell";
import { formatDateTimeToVnFormat } from "@utils/helpers";
import { items } from "@components/emergency/EmergencyConstant";
import ModalEmergencyDetail from "@components/emergency/ModalEmergencyDetail";
import { TypeOptions, toast } from "react-toastify";
import ModalSolvedEmergency from "@components/emergency/ModalSolvedEmergency";
import ModalCancelBookingImmediately from "@components/emergency/ModalCancelBookingImmediately";
import { setStaffBusyStatus } from "@slices/staff";

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});
const { confirm } = Modal;
const { Column } = Table;

type OnChange = NonNullable<TableProps<EmergencyType>["onChange"]>;
type Filters = Parameters<OnChange>[1];

type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

const Emergency: React.FC = () => {
  const { data: session } = useSession();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [emergencyListData, setEmergencyListData] = useState<EmergencyType[]>(
    []
  );
  const [tablePagination, setTablePagination] = useState<PagingModel>({
    pageIndex: 1,
    pageSize: 10,
    pageSkip: 0,
    totalPage: 0,
    totalSize: 0,
  });
  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});

  //quản lý state các action dropdown action
  const [selectedEmergency, setSelectedEmergency] =
    useState<EmergencyType | null>(null);

  const [openModalEmergencyDetail, setOpenModalEmergencyDetail] =
    useState<boolean>(false);

  const [openModalSolvedEmergency, setOpenModalSolvedEmergency] =
    useState<boolean>(false);

  const [
    openModalModalCancelBookingImmediately,
    setOpenModalCancelBookingImmediately,
  ] = useState<boolean>(false);

  const getEmergencyListData = async () => {
    setLoading(true);
    await emergencyService
      .getAllEmergency(session?.user.access_token!, {
        pageSize: tablePagination.pageSize,
        pageIndex: tablePagination.pageIndex,
      } as ParamGet)
      .then((res: EmergencyListData) => {
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

  //xử lý khi click vào item trong list action
  const createMenu = (record: EmergencyType) => {
    const { status, isStopTrip } = record;

    let filteredItems;

    if (status === EmergencyStatusEnum.Pending) {
      filteredItems = items?.filter(
        (item) => item?.key === "1" || item?.key === "2"
      );
    } else if (status === EmergencyStatusEnum.Processing) {
      filteredItems = items?.filter(
        (item) => item?.key === "1" || item?.key === "3"
      );
    } else if (status === EmergencyStatusEnum.Solved) {
      filteredItems = items?.filter(
        (item) => item?.key === "1" || (item?.key === "4" && !isStopTrip)
      );
    }

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

  const handleMenuClick = async (key: string, record: EmergencyType) => {
    setSelectedEmergency(record);
    switch (key) {
      case "1":
        setOpenModalEmergencyDetail(true);
        // handleOpenDetail(record);
        break;
      case "2":
        await emergencyService
          .changeToProcessingStatus(session?.user.access_token!, record.id)
          .then((res) => {
            dispatch(setStaffBusyStatus(false));
            toast(`Chuyển trạng thái sang xử lý thành công`, {
              type: "success" as TypeOptions,
              position: "top-right",
            });

            setEmergencyListData((prevData: any) =>
              prevData.map((item: EmergencyType) =>
                item.id === record.id
                  ? { ...item, status: EmergencyStatusEnum.Processing }
                  : item
              )
            );
            setLoading(false);
          })
          .catch((errors) => {
            toast(`${errors.response.data}`, {
              type: "error" as TypeOptions,
              position: "top-right",
            });
            console.log("errors to change emergency status", errors);
          })
          .finally(() => {
            setLoading(false);
          });

        break;
      case "3":
        setOpenModalSolvedEmergency(true);
        break;
      case "4":
        setOpenModalCancelBookingImmediately(true);
        break;
      case "5":
        break;
      case "6":
        break;
      case "7":
        break;
      default:
        break;
    }
  };

  // use effect
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
                <Button onClick={clearAll}>Xóa bộ lọc </Button>
              </Space>
            </div>

            <Table
              dataSource={emergencyListData}
              onChange={onChangeTable}
              loading={loading}
              pagination={{
                pageSize: tablePagination.pageSize,
                total: tablePagination.totalSize,
              }}
              scroll={{ x: 2000 }}
            >
              <Column
                title="Người gửi"
                dataIndex="sender"
                key="senderName"
                render={(text, record: EmergencyType) => record.sender.name}
                sorter={(a: EmergencyType, b: EmergencyType) =>
                  a.sender.name.localeCompare(b.sender.name)
                }
                fixed="left"
              />
              <Column
                title="Số điện thoại"
                dataIndex="sender"
                key="senderPhone"
                render={(text, record: EmergencyType) =>
                  record.sender.phoneNumber || "(Chưa cập nhập)"
                }
                sorter={(a: EmergencyType, b: EmergencyType) => {
                  const phoneA = a.sender.phoneNumber || "";
                  const phoneB = b.sender.phoneNumber || "";
                  return phoneA.localeCompare(phoneB);
                }}
                fixed="left"
              />
              <Column
                title="Mã chuyến đi"
                dataIndex="booking"
                key="bookingId"
                render={(text, record: EmergencyType) =>
                  removeHyphens(record.booking.id || "(Chưa cập nhập)")
                }
                sorter={(a: EmergencyType, b: EmergencyType) => {
                  const bookingA = a.booking.id || "";
                  const bookingB = b.booking.id || "";
                  return bookingA.localeCompare(bookingB);
                }}
              />
              <Column
                title="Người xử lý"
                dataIndex="handler"
                key="handlerName"
                render={(text, record: EmergencyType) => record.handler.name}
                sorter={(a: EmergencyType, b: EmergencyType) => {
                  const nameA = a.handler.name || "";
                  const nameB = b.handler.name || "";
                  return nameA.localeCompare(nameB);
                }}
              />
              <Column
                title="Nơi gửi"
                dataIndex="senderAddress"
                key="senderAddress"
                sorter={(a: EmergencyType, b: EmergencyType) => {
                  const senderAddressA = a.senderAddress || "";
                  const senderAddressB = b.senderAddress || "";
                  return senderAddressA.localeCompare(senderAddressB);
                }}
                width="20%"
                render={(text) => text}
              />
              <Column
                title="Chú thích"
                dataIndex="note"
                key="note"
                render={(text) => splitString(text)}
                width="20%"
              />
              <Column
                title="Ngày khởi tạo"
                dataIndex="dateCreated"
                key="dateCreated"
                render={(text, record: EmergencyType) =>
                  formatDateTimeToVnFormat(record.dateCreated)
                }
              />
              <Column
                title="Loại khẩn cấp"
                dataIndex="emergencyType"
                key="emergencyType"
                filters={[
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
                ]}
                onFilter={(value, record: EmergencyType) =>
                  (record.emergencyType || "").startsWith(value as string)
                }
                width="7%"
                fixed="right"
              />
              <Column
                title="Trạng thái"
                dataIndex="status"
                key="status"
                fixed="right"
                filters={[
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
                ]}
                onFilter={(value, record: EmergencyType) =>
                  (record.status || "").startsWith(value as string)
                }
                render={(text) => <StatusCell status={text} />}
                width="5%"
              />
              <Column
                title="Hành động"
                dataIndex=""
                key="action"
                fixed="right"
                render={(text, record: EmergencyType) => (
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

          {selectedEmergency && (
            <ModalEmergencyDetail
              open={openModalEmergencyDetail}
              dataEmergency={selectedEmergency}
              onClose={() => setOpenModalEmergencyDetail(false)}
            />
          )}

          {selectedEmergency && (
            <ModalSolvedEmergency
              open={openModalSolvedEmergency}
              onClose={() => {
                setOpenModalSolvedEmergency(false);
                setSelectedEmergency(null);
              }}
              dataEmergency={selectedEmergency}
              setEmergencyListData={setEmergencyListData}
              onSubmit={() => {
               
              }}
            />
          )}

          {selectedEmergency && (
            <ModalCancelBookingImmediately
              open={openModalModalCancelBookingImmediately}
              onClose={() => {
                setOpenModalCancelBookingImmediately(false);
                setSelectedEmergency(null);
              }}
              dataEmergency={selectedEmergency}
              setEmergencyListData={setEmergencyListData}
              onSubmit={() => {}}
            />
          )}
        </>
      }
    />
  );
};

export default Emergency;
