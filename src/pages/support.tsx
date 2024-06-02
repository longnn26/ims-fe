"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { Button, Dropdown, Menu, Modal, Space } from "antd";
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
import {
  formatDate,
  translateStatusToVnLanguage,
  translateTypeToVnLanguage,
} from "@utils/helpers";
import { SupportStatusEnum, SupportTypeModelEnum } from "@utils/enum";
import StatusCell from "@components/table/StatusCell";
import { items } from "@components/support/SupportConstant";
import supportServices from "@services/support";
import { TypeOptions, toast } from "react-toastify";
import ModalPauseSupport from "@components/support/ModalPauseSupport";
import ModalCreateDriverAccount from "@components/ModalCreateDriverAccount";
import ModalSupportDetail from "@components/support/ModalSupportDetail";

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});
const { confirm } = Modal;
const { Column } = Table;

type OnChange = NonNullable<TableProps<SupportType>["onChange"]>;
type Filters = Parameters<OnChange>[1];

type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

const Support: React.FC = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [supportsListData, setSupportsListData] = useState<SupportType[]>([]);
  const [tablePagination, setTablePagination] = useState<SupportListData>({
    pageIndex: 1,
    pageSize: 10,
    pageSkip: 0,
    totalPage: 3,
    totalSize: 20,
  });
  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});
  const [selectedSupport, setSelectedSupport] = useState<SupportType | null>(
    null
  );
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  //state khi ấn action dropdown
  const [openModalSupportDetail, setOpenModalSupportDetail] =
    useState<boolean>(false);

  const [openModalPauseSupport, setOpenModalPauseSupport] =
    useState<boolean>(false);

  const [openModalCreateDriverAccount, setOpenModalCreateDriverAccount] =
    useState<boolean>(false);

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

        setSupportsListData(res.data ?? []);
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

  //xử lý khi click vào item trong list action
  const createMenu = (record: SupportType) => {
    const { supportStatus, supportType } = record;

    let filteredItems;

    if (supportStatus === SupportStatusEnum.NEW) {
      filteredItems = items?.filter(
        (item) => item?.key === "1" || item?.key === "3"
      );

      if (supportType === SupportTypeModelEnum.RECRUITMENT) {
        filteredItems = [
          ...filteredItems,
          ...(items?.filter((item) => item?.key === "2") || []),
        ];
      }
    } else if (supportStatus === SupportStatusEnum.IN_PROCESS) {
      filteredItems = items?.filter(
        (item) => item?.key === "1" || item?.key === "4" || item?.key === "5"
      );

      if (supportType === SupportTypeModelEnum.RECRUITMENT) {
        filteredItems = [
          ...filteredItems,
          ...(items?.filter((item) => item?.key === "2") || []),
        ];
      }
    } else if (supportStatus === SupportStatusEnum.SOLVED) {
      filteredItems = items?.filter((item) => item?.key === "1");
    } else if (supportStatus === SupportStatusEnum.CANT_SOLVED) {
      filteredItems = items?.filter(
        (item) => item?.key === "1" || item?.key === "4"
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

  const handleMenuClick = async (key: string, record: SupportType) => {
    setSelectedSupport(record);
    switch (key) {
      case "1":
        setOpenModalSupportDetail(true);
        break;
      case "2":
        //tạo tài khoản với support là ứng tuyển
        setOpenModalCreateDriverAccount(true);
        break;
      case "3":
        //chuyển sang đang tiến hành
        await supportServices
          .changeToInProcessStatus(session?.user.access_token!, record.id)
          .then((res) => {
            toast(`Chuyển trạng thái sang đang xử lý thành công`, {
              type: "success" as TypeOptions,
              position: "top-right",
            });

            setSupportsListData((prevData: any) =>
              prevData.map((item: SupportType) =>
                item.id === record.id
                  ? { ...item, supportStatus: SupportStatusEnum.IN_PROCESS }
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
            console.log("errors to change support status", errors);
          })
          .finally(() => {
            setLoading(false);
          });
        break;
      case "4":
        // đánh dấu đã giải quyết
        confirm({
          cancelText: "Hủy",
          okText: "Xác nhận",
          title: "Bạn có chắc là đã xử lý xong đơn hỗ trợ này?",
          async onOk() {
            setLoadingSubmit(true);

            await supportService
              .changeToSolvedStatus(session?.user.access_token!, record.id)
              .then((res) => {
                setSupportsListData((prevData: any) =>
                  prevData.map((item: SupportType) =>
                    item.id === record.id
                      ? { ...item, supportStatus: SupportStatusEnum.SOLVED }
                      : item
                  )
                );

                toast(`Chuyển trạng thái sang đã xử lý thành công!`, {
                  type: "success" as TypeOptions,
                  position: "top-right",
                });
              })
              .catch((errors) => {
                toast(`${errors.response.data}`, {
                  type: "error" as TypeOptions,
                  position: "top-right",
                });
                console.log("errors to change support status", errors);
              })
              .finally(() => {
                setLoadingSubmit(false);
              });
          },
          onCancel() {},
        });
        break;
      case "5":
        // đánh dấu tạm thời không thể giải quyết
        setOpenModalPauseSupport(true);
        break;
      default:
        break;
    }
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
                <Button onClick={clearAll}>Xóa bộ lọc </Button>
              </Space>
            </div>

            <Table
              // columns={columns}
              dataSource={supportsListData}
              onChange={onChangeTable}
              loading={loading}
              pagination={{
                pageSize: tablePagination.pageSize,
                total: tablePagination.totalSize,
              }}
            >
              <Column
                title="Họ và tên"
                dataIndex="fullName"
                key="fullName"
                sorter={(a: any, b: any) => a?.fullName - b.fullName}
              />
              <Column
                title="Số điện thoại"
                dataIndex="phoneNumber"
                key="phoneNumber"
              />
              <Column
                title="Loại hỗ trợ"
                dataIndex="supportType"
                key="supportType"
                filters={[
                  {
                    text: translateTypeToVnLanguage(
                      SupportTypeModelEnum.RECRUITMENT
                    ),
                    value: SupportTypeModelEnum.RECRUITMENT,
                  },
                  {
                    text: translateTypeToVnLanguage(
                      SupportTypeModelEnum.BOOKING_ISSUE
                    ),
                    value: SupportTypeModelEnum.BOOKING_ISSUE,
                  },
                  {
                    text: translateTypeToVnLanguage(
                      SupportTypeModelEnum.SUPPORT_ISSUE
                    ),
                    value: SupportTypeModelEnum.SUPPORT_ISSUE,
                  },
                ]}
                sorter={(a: SupportType, b: SupportType) =>
                  a?.supportType.localeCompare(b.supportType)
                }
                onFilter={(value, record) =>
                  record.supportType.startsWith(value as string)
                }
                render={(text, record) =>
                  translateTypeToVnLanguage(record.supportType)
                }
              />
              <Column
                title="Trạng thái hỗ trợ"
                dataIndex="supportStatus"
                key="supportStatus"
                filters={[
                  {
                    text: translateStatusToVnLanguage(SupportStatusEnum.NEW),
                    value: SupportStatusEnum.NEW,
                  },
                  {
                    text: translateStatusToVnLanguage(
                      SupportStatusEnum.IN_PROCESS
                    ),
                    value: SupportStatusEnum.IN_PROCESS,
                  },
                  {
                    text: translateStatusToVnLanguage(SupportStatusEnum.SOLVED),
                    value: SupportStatusEnum.SOLVED,
                  },
                  {
                    text: "Can't Solved",
                    value: SupportStatusEnum.CANT_SOLVED,
                  },
                ]}
                onFilter={(value, record: SupportType) =>
                  (record?.supportStatus || "").startsWith(value as string)
                }
                render={(text) => <StatusCell status={text} />}
              />
              <Column
                title="Thời gian tạo"
                dataIndex="dateCreated"
                key="dateCreated"
                sorter={(a: SupportType, b: SupportType) =>
                  (a?.dateCreated || "").localeCompare(b?.dateCreated || "")
                }
                render={(text: string) => formatDate(text)}
              />
              <Column
                title="Hành động"
                dataIndex=""
                key="action"
                render={(text, record: SupportType) => (
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

          {selectedSupport && (
            <ModalPauseSupport
              open={openModalPauseSupport}
              dataSupport={selectedSupport}
              onClose={() => setOpenModalPauseSupport(false)}
              setSupportsListData={setSupportsListData}
            />
          )}

          {selectedSupport && (
            <ModalCreateDriverAccount
              open={openModalCreateDriverAccount}
              dataSupport={selectedSupport}
              onClose={() => setOpenModalCreateDriverAccount(false)}
              setSupportsListData={setSupportsListData}
            />
          )}

          {selectedSupport && (
            <ModalSupportDetail
              open={openModalSupportDetail}
              dataSupport={selectedSupport}
              onClose={() => setOpenModalSupportDetail(false)}
            />
          )}
        </>
      }
    />
  );
};

export default Support;
