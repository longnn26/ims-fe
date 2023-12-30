"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import React from "react";
import { ParamGet } from "@models/base";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import {
  getCustomerData,
  getCustomerServerAllocationData,
  getServerAllocationData,
} from "@slices/serverAllocation";
import {
  SACreateModel,
  SAUpdateModel,
  ServerAllocation,
  ServerAllocationData,
} from "@models/serverAllocation";
import { Button, Pagination, message, Modal, Alert } from "antd";
import ServerAllocationTable from "@components/server/ServerAllocationTable";
import ModalCreate from "@components/server/ModalCreate";
import serverAllocationService from "@services/serverAllocation";
import ModalUpdate from "@components/server/ModalUpdate";
import { areInArray, parseJwt } from "@utils/helpers";
import { ROLE_CUSTOMER, ROLE_SALES, ROLE_TECH } from "@utils/constants";

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});

const { confirm } = Modal;

const Customer: React.FC = () => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const { serverAllocationData } = useSelector(
    (state) => state.serverAllocation
  );

  const [paramGet, setParamGet] = useState<ParamGet>({
    PageIndex: 1,
    PageSize: 7,
  } as ParamGet);

  const [customerSelectParamGet, setCustomerSelectParamGet] =
    useState<ParamGet>({
      PageIndex: 1,
      PageSize: 6,
    } as ParamGet);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [serverAllocationUpdate, setServerAllocationUpdate] = useState<
    ServerAllocation | undefined
  >(undefined);
  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);

  const getData = async () => {
    var customerId = "";
    if (session?.user.roles.includes("Customer")) {
      customerId = parseJwt(session.user.access_token).UserId;
    }
    dispatch(
      getServerAllocationData({
        token: session?.user.access_token!,
        paramGet: { ...paramGet, CustomerId: customerId },
      })
    ).then(({ payload }) => {
      var res = payload as ServerAllocationData;
      if (res?.totalPage < paramGet.PageIndex && res.totalPage != 0) {
        setParamGet({
          ...paramGet,
          PageIndex: res.totalPage,
          CustomerId: customerId,
        });
      }
    });
  };

  // const createData = async (data: SACreateModel) => {
  //   setLoadingSubmit(true);

  //   try {
  //     const userRoles = session?.user.roles;

  //     if (areInArray(userRoles ?? [], ROLE_CUSTOMER)) {
  //       const userId = parseJwt(session?.user.access_token).UserId;

  //       // Gọi hàm getCustomerServerData với id của người dùng
  //       await serverAllocationService
  //         .createServerAllocation(session?.user.access_token!, data)
  //         .then(() => {
  //           message.success("Create successfully!");
  //           getData();
  //         });
  //     } else {
  //       await serverAllocationService
  //         .createServerAllocation(session?.user.access_token!, data)
  //         .then(() => {
  //           message.success("Create successfully!");
  //           getData();
  //         });
  //     }
  //   } catch (errors) {
  //     if (errors instanceof Error) {
  //       // If errors is an instance of the Error class, handle it accordingly
  //       const errorMessage = (errors as any).response?.data || errors.message;
  //       message.error(errorMessage);
  //     } else {
  //       // If errors is of unknown type, provide a default error message
  //       message.error("An unknown error occurred");
  //     }
  //   } finally {
  //     setLoadingSubmit(false);
  //     setOpenModalCreate(false);
  //   }
  // };

  const updateData = async (data: SAUpdateModel) => {
    await serverAllocationService
      .updateServerAllocation(session?.user.access_token!, data)
      .then((res) => {
        message.success("Update successfully!");
        getData();
      })
      .catch((errors) => {
        message.error(errors.response.data);
      })
      .finally(() => {
        setServerAllocationUpdate(undefined);
      });
  };

  const deleteServerAllocation = (serverAllocation: ServerAllocation) => {
    confirm({
      title: "Delete",
      content: (
        <Alert
          message={`Do you want to delete with Id ${serverAllocation.id}?`}
          // description={`${serverAllocation.id}`}
          type="warning"
        />
      ),
      async onOk() {
        setLoadingSubmit(true);
        await serverAllocationService
          .deleteServerAllocation(
            session?.user.access_token!,
            serverAllocation.id
          )
          .then(() => {
            getData();
            message.success(`Delete server allocation successfully!`);
          })
          .catch((errors) => {
            message.error(errors.response.data ?? "Delete allocation failed");
            setLoadingSubmit(false);
          });
      },
      onCancel() {},
    });
  };

  useEffect(() => {
    session && getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, paramGet, openModalCreate]);

  useEffect(() => {
    session &&
      dispatch(
        getCustomerData({
          token: session?.user.access_token!,
          paramGet: { ...customerSelectParamGet },
        })
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, customerSelectParamGet]);

  return (
    <AntdLayoutNoSSR
      content={
        <>
          <div className="flex justify-between mb-4 p-2 bg-[#f8f9fa]/10 border border-gray-200 rounded-lg shadow-lg shadow-[#e7edf5]/50">
            {areInArray(session?.user.roles!, ROLE_CUSTOMER) && (
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => {
                  setOpenModalCreate(true);
                }}
              >
                Create
              </Button>
            )}
            {/* <SearchComponent
            placeholder="Search Name, Description..."
            setSearchValue={(value) =>
              setParamGet({ ...paramGet, SearchValue: value })
            }
          /> */}
          </div>
          {areInArray(
            session?.user.roles!,
            ROLE_SALES,
            ROLE_TECH,
            ROLE_CUSTOMER
          ) && (
            <>
              <ServerAllocationTable
                onEdit={(record) => {
                  setServerAllocationUpdate(record);
                }}
                onDelete={async (record) => {
                  deleteServerAllocation(record);
                }}
              />

              <ModalCreate
                open={openModalCreate}
                onClose={() => setOpenModalCreate(false)}
                onSubmit={() => {
                  setOpenModalCreate(false);
                  getData();
                }}
                customerParamGet={customerSelectParamGet}
                setCustomerParamGet={setCustomerSelectParamGet}
              />
              <ModalUpdate
                serverAllocation={serverAllocationUpdate!}
                onClose={() => setServerAllocationUpdate(undefined)}
                onSubmit={(data: SAUpdateModel) => {
                  updateData(data);
                }}
              />
              {serverAllocationData?.totalPage > 0 && (
                <Pagination
                  className="text-end m-4"
                  current={paramGet.PageIndex}
                  pageSize={serverAllocationData?.pageSize ?? 10}
                  total={serverAllocationData?.totalSize}
                  onChange={(page, pageSize) => {
                    setParamGet({
                      ...paramGet,
                      PageIndex: page,
                      PageSize: pageSize,
                    });
                  }}
                />
              )}
            </>
          )}
        </>
      }
    />
  );
};

export default Customer;
