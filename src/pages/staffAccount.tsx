"use client";
import React, { useEffect, useState } from "react";
import { Button, Empty, message, Pagination } from "antd";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import useDispatch from "@hooks/use-dispatch";
import { ParamGet } from "@models/base";
//import ModalCreate from "@components/admin/ModalCreate";
import {
  UserData,
  User,
  UserCreateModel,
  UserUpdateModel,
  UserUpdateRole,
} from "@models/user";
import { getUserData } from "@slices/user";
import userService from "@services/user";
import useSelector from "@hooks/use-selector";
import StaffAccountTable from "@components/admin/StaffAccountTable";
import StaffAccountDetail from "@components/admin/StaffAccountDetail";
import StaffRole from "@components/admin/StaffRole";
import ModalCreate from "@components/admin/ModalCreate";
import ModalUpdate from "@components/admin/ModalUpdate";
import ModalUpdateRole from "@components/admin/ModalUpdateRole";
import { areInArray } from "@utils/helpers";
import { ROLE_ADMIN } from "@utils/constants";

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});

const StaffAccountPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const { userData } = useSelector((state) => state.user);
  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
  const [openModalUpdateRole, setOpenModalUpdateRole] =
    useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [reloadStaffRole, setReloadStaffRole] = useState<boolean>(false);
  const [staffAccountDetail, setStaffAccountDetail] = useState<
    User | undefined
  >(undefined);

  const [paramGet, setParamGet] = useState<ParamGet>({
    PageIndex: 1,
    PageSize: 10,
  } as ParamGet);

  const getData = async () => {
    dispatch(
      getUserData({
        token: session?.user.access_token!,
        paramGet: { ...paramGet },
      })
    ).then(({ payload }) => {
      var res = payload as UserData;
      if (res?.totalPage < paramGet.PageIndex && res.totalPage !== 0) {
        setParamGet({ ...paramGet, PageIndex: res.totalPage });
      }

      // Fetch staff role data here
      // For example, assuming staff roles are part of the user data
      const selectedUser = res?.data.find(
        (user) => user.id === staffAccountDetail?.id
      );
      if (selectedUser) {
        setStaffAccountDetail(selectedUser);
      }
    });
  };

  const createData = async (data: UserCreateModel) => {
    await userService
      .create(session?.user.access_token!, data)
      .then((res) => {
        message.success("Create successfully!");
        getData();
      })
      .catch((errors) => {
        message.error(errors.response.data);
      })
      .finally(() => {
        setOpenModalCreate(false);
      });
  };
  const updateData = async (data: UserUpdateModel) => {
    await userService
      .update(session?.user.access_token!, data)
      .then((res) => {
        message.success("Update successfully!");
        getData();
      })
      .catch((errors) => {
        message.error(errors.response.data);
      })
      .finally(() => {
        setOpenModalUpdate(false);
      });
  };

  const deleteRole = async (data: UserUpdateRole) => {
    await userService
      .deleteRole(session?.user.access_token!, data)
      .then((res) => {
        if (!res) {
          message.success("Delete position(s) successfully!");
        }

        // Update staffAccountDetail with the latest data
        setStaffAccountDetail((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            positions: res.updatedRoles || [],
          };
        });

        getData(); // Add this line to fetch the latest data
      })
      .catch((errors) => {
        message.error(errors.response.data);
      })
      .finally(() => {
        setOpenModalUpdateRole(false);
      });
  };

  const addRole = async (data: UserUpdateRole) => {
    await userService
      .addRole(session?.user.access_token!, data)
      .then((res) => {
        if (!res) {
          message.success("Add position(s) successfully!");
          getData();
        }
      })
      .catch((errors) => {
        message.error(errors.response.data);
      })
      .finally(() => {
        setOpenModalUpdateRole(false);
      });
  };

  useEffect(() => {
    session && getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, paramGet]);

  return (
    <AntdLayoutNoSSR
      content={
        <>
          {areInArray(session?.user.roles!, ROLE_ADMIN) && (
            <>
              <div className="flex justify-between mb-4 p-2 bg-[#f8f9fa]/10 border border-gray-200 rounded-lg shadow-lg shadow-[#e7edf5]/50">
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={() => {
                    setOpenModalCreate(true);
                  }}
                >
                  Create
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={() => {
                    setOpenModalUpdate(true);
                  }}
                >
                  Update Information
                </Button>
              </div>
              <ModalCreate
                open={openModalCreate}
                onClose={() => setOpenModalCreate(false)}
                onSubmit={(data: UserCreateModel) => {
                  createData(data);
                }}
              />
              <ModalUpdate
                open={openModalUpdate}
                onClose={() => setOpenModalUpdate(false)}
                data={staffAccountDetail}
                onSubmit={(data: UserUpdateModel) => {
                  updateData(data);
                }}
              />
              <ModalUpdateRole
                open={openModalUpdateRole}
                onClose={() => setOpenModalUpdateRole(false)}
                data={staffAccountDetail}
                isDelete={isDelete}
                onSubmit={(data: UserUpdateRole) => {
                  if (isDelete) {
                    deleteRole(data);
                  } else {
                    addRole(data);
                  }
                }}
              />
              <div className="flex justify-between mb-4 p-2 bg-[#f8f9fa]/10 border border-gray-200 rounded-lg shadow-lg shadow-[#e7edf5]/50">
                {/* Left side: StaffAccountTable */}
                <div style={{ width: "calc(100% - 70%)" }}>
                  <StaffAccountTable
                    onRowClick={(record) => {
                      const selectedUser = userData?.data.find(
                        (user) => user.id === record.id
                      );
                      if (selectedUser) {
                        setStaffAccountDetail(selectedUser);
                      }
                    }}
                  />
                  {userData.totalPage > 0 && (
                    <Pagination
                      className="text-end m-4"
                      current={paramGet.PageIndex}
                      pageSize={userData.pageSize ?? 10}
                      total={userData.totalSize}
                      onChange={(page, pageSize) => {
                        setParamGet({
                          ...paramGet,
                          PageIndex: page,
                          PageSize: pageSize,
                        });
                      }}
                    />
                  )}
                </div>

                {/* Right side */}
                <div>
                  <StaffAccountDetail staffAccountDetail={staffAccountDetail} />
                  <div className="flex justify-end mb-4 p-2 bg-[#f8f9fa]/10 border border-gray-200 rounded-lg shadow-lg shadow-[#e7edf5]/50">
                    {staffAccountDetail === undefined ||
                      (staffAccountDetail.positions &&
                        staffAccountDetail.positions.length < 3 && (
                          <Button
                            type="primary"
                            className="ml-auto mr-2"
                            htmlType="submit"
                            onClick={() => {
                              setOpenModalUpdateRole(true);
                              setIsDelete(false);
                            }}
                          >
                            (+) Add Position
                          </Button>
                        ))}

                    {staffAccountDetail !== undefined &&
                      staffAccountDetail.positions && // Check if positions is defined
                      staffAccountDetail.positions.length > 1 &&
                      staffAccountDetail.positions.length <= 3 && (
                        <Button
                          type="primary"
                          htmlType="submit"
                          onClick={() => {
                            setOpenModalUpdateRole(true);
                            setIsDelete(true);
                          }}
                        >
                          (X) Delete Position
                        </Button>
                      )}
                  </div>
                  <StaffRole staffRole={staffAccountDetail?.positions} />
                </div>
              </div>
            </>
          )}
        </>
      }
    />
  );
};

export default StaffAccountPage;
