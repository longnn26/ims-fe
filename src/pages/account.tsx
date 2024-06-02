"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { Button, Dropdown, Menu, Modal, Space } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { Table } from "antd";
import type { TableProps } from "antd";
import { User, UserListData } from "@models/user";
import accountService from "@services/customer";
import { PagingModel, ParamGet } from "@models/base";
import { useSession } from "next-auth/react";
import StatusCell from "@components/table/StatusCell";
import {
  formatDateTimeToVnFormat,
  translateGenderToVietnamese,
} from "@utils/helpers";
import { items } from "@components/account/AccountConstant";
import { TypeOptions, toast } from "react-toastify";
import TextNotUpdate from "@components/table/TextNotUpdate";
import ModalAccountDetail from "@components/account/ModalAccountDetail";
import ProfileCell from "@components/table/ProfileCell";

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});
const { confirm } = Modal;
const { Column } = Table;

type OnChange = NonNullable<TableProps<User>["onChange"]>;
type Filters = Parameters<OnChange>[1];

type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

const Account: React.FC = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [accountListData, setAccountListData] = useState<User[]>([]);
  const [tablePagination, setTablePagination] = useState<PagingModel>({
    pageIndex: 1,
    pageSize: 10,
    pageSkip: 0,
    totalPage: 0,
    totalSize: 0,
  });
  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});

  const [selectedAccount, setSelectedAccount] = useState<User | null>(null);

  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  //quản lý các state cho action
  const [openModalAccountDetail, setOpenModalAccountDetail] =
    useState<boolean>(false);

  const getAccountListData = async () => {
    setLoading(true);
    await accountService
      .getAllUserByAdmin(session?.user.access_token!, {
        pageSize: tablePagination.pageSize,
        pageIndex: tablePagination.pageIndex,
      } as ParamGet)
      .then((res: UserListData) => {
        console.log("res", res.data);
        setTablePagination({
          ...tablePagination,
          pageSize: res.pageSize,
          totalPage: res.totalPage,
          totalSize: res.totalSize,
        });

        setAccountListData(res.data);

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

  const onChangeTable: TableProps<User>["onChange"] = (
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
  const createMenu = (record: User) => {
    const { isActive, role } = record;

    let filteredItems;

    if (session?.user.roles.includes("Admin")) {
      if (isActive) {
        filteredItems = items?.filter(
          (item) => item?.key === "1" || item?.key === "2"
        );
      } else {
        filteredItems = items?.filter(
          (item) => item?.key === "1" || item?.key === "3"
        );
      }
    } else if (session?.user.roles.includes("Staff")) {
      if (role === "Staff") {
        filteredItems = items?.filter((item) => item?.key === "1");
      } else {
        if (isActive) {
          filteredItems = items?.filter(
            (item) => item?.key === "1" || item?.key === "2"
          );
        } else {
          filteredItems = items?.filter(
            (item) => item?.key === "1" || item?.key === "3"
          );
        }
      }
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

  const handleMenuClick = async (key: string, record: User) => {
    setSelectedAccount(record);
    switch (key) {
      case "1":
        setOpenModalAccountDetail(true);
        break;
      case "2":
        confirm({
          cancelText: "Hủy",
          okText: "Xác nhận",
          title: "Bạn có chắc muốn ban tài khoản này chứ?",
          async onOk() {
            setLoadingSubmit(true);

            console.log("ban selectedAccount?.id ", record?.id);
            await accountService
              .banAccount(session?.user.access_token!, {
                userId: record?.id ?? "",
              })
              .then((res) => {
                console.log("res ban account: ", res);
                setAccountListData((prevData: any) =>
                  prevData.map((item: User) =>
                    item.id === record?.id
                      ? {
                          ...item,
                          isActive: false,
                        }
                      : item
                  )
                );
                toast(`Ban tài khoản thành công`, {
                  type: "success" as TypeOptions,
                  position: "top-right",
                });
              })
              .catch((err) => {
                toast(`${err.response.data}`, {
                  type: "error" as TypeOptions,
                  position: "top-right",
                });
                console.log("errors change to ban account: ", err);
              })
              .finally(() => {
                setLoadingSubmit(false);
              });
          },
          onCancel() {},
        });
        break;
      case "3":
        confirm({
          cancelText: "Hủy",
          okText: "Xác nhận",
          title: "Bạn có chắc muốn gỡ ban tài khoản này chứ?",
          async onOk() {
            setLoadingSubmit(true);
            console.log("gỡ bạn selectedAccount?.id ", record?.id);

            await accountService
              .unBanAccount(session?.user.access_token!, {
                userId: record?.id ?? "",
              })
              .then((res) => {
                console.log("res unban account: ", res);
                setAccountListData((prevData: any) =>
                  prevData.map((item: User) =>
                    item.id === record?.id
                      ? {
                          ...item,
                          isActive: true,
                        }
                      : item
                  )
                );

                toast(`Gỡ ban tài khoản thành công`, {
                  type: "success" as TypeOptions,
                  position: "top-right",
                });
              })
              .catch((err) => {
                toast(`${err.response.data}`, {
                  type: "error" as TypeOptions,
                  position: "top-right",
                });
                console.log("errors change to unban account: ", err);
              })
              .finally(() => {
                setLoadingSubmit(false);
              });
          },
          onCancel() {},
        });
        break;

      default:
        break;
    }
  };

  // use effect
  useEffect(() => {
    session && getAccountListData();
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
              dataSource={accountListData}
              onChange={onChangeTable}
              loading={loading}
              pagination={{
                pageSize: tablePagination.pageSize,
                total: tablePagination.totalSize,
              }}
            >
              <Column
                title="Tài khoản"
                dataIndex="name"
                key="name"
                render={(text, record: User) => <ProfileCell user={record} />}
                sorter={(a: User, b: User) => {
                  const nameA = a.name || "";
                  const nameB = b.name || "";
                  return nameA.localeCompare(nameB);
                }}
              />
              <Column
                title="Số điện thoại"
                dataIndex="phoneNumber"
                key="phoneNumber"
                render={(text, record: User) =>
                  record.phoneNumber || <TextNotUpdate />
                }
                sorter={(a: User, b: User) => {
                  const phoneA = a.phoneNumber || "";
                  const phoneB = b.phoneNumber || "";
                  return phoneA.localeCompare(phoneB);
                }}
              />
              <Column
                title="Giới tính"
                dataIndex="gender"
                key="gender"
                render={(text, record: User) => {
                  const translatedGender = translateGenderToVietnamese(
                    record?.gender ?? ""
                  );

                  if (translatedGender === "(Chưa cập nhập)") {
                    return <TextNotUpdate />;
                  }

                  return translatedGender;
                }}
                sorter={(a: User, b: User) => {
                  const genderA = a.gender || "";
                  const genderB = b.gender || "";
                  return genderA.localeCompare(genderB);
                }}
              />
              <Column
                title="Ngày sinh"
                dataIndex="dob"
                key="dob"
                render={(text, record: User) => record.dob || <TextNotUpdate />}
                sorter={(a: User, b: User) => {
                  const nameA = a.dob || "";
                  const nameB = b.dob || "";
                  return nameA.localeCompare(nameB);
                }}
              />
              <Column
                title="Trạng thái"
                dataIndex="isActive"
                key="isActive"
                sorter={(a: User, b: User) => {
                  const statusA = a.isActive !== undefined ? a.isActive : false;
                  const statusB = b.isActive !== undefined ? b.isActive : false;
                  return statusA === statusB ? 0 : statusA ? -1 : 1;
                }}
                render={(isActive) =>
                  isActive ? (
                    <p className="text-green-600">Đang hoạt động</p>
                  ) : (
                    <p className="text-red-600">Đã bị ban</p>
                  )
                }
              />

              <Column
                title="Vai trò"
                dataIndex="role"
                key="role"
                render={(text) => text}
              />
              <Column
                title="Ngày khởi tạo"
                dataIndex="dateCreated"
                key="dateCreated"
                render={(text, record: User) =>
                  formatDateTimeToVnFormat(record.dateCreated)
                }
              />
              <Column
                title="Hành động"
                dataIndex=""
                key="action"
                render={(text, record: User) => (
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

          {selectedAccount && (
            <ModalAccountDetail
              open={openModalAccountDetail}
              dataAccount={selectedAccount}
              onClose={() => setOpenModalAccountDetail(false)}
            />
          )}
        </>
      }
    />
  );
};

export default Account;
