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
  SParamGet,
  ServerAllocation,
  ServerAllocationData,
} from "@models/serverAllocation";
import {
  Button,
  Pagination,
  message,
  Modal,
  Alert,
  Tabs,
  TabsProps,
} from "antd";
import ServerAllocationTable from "@components/server/ServerAllocationTable";
import ModalCreate from "@components/server/ModalCreate";
import serverAllocationService from "@services/serverAllocation";
import ModalUpdate from "@components/server/ModalUpdate";
import { areInArray, parseJwt } from "@utils/helpers";
import {
  ROLE_CUSTOMER,
  ROLE_MANAGER,
  ROLE_SALES,
  ROLE_TECH,
} from "@utils/constants";
import SearchComponent from "@components/SearchComponent";
import ModalAlert from "@components/server/ModalAlert";

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
  const [status, setStatus] = useState<string | undefined>(undefined);

  const [paramGet, setParamGet] = useState<SParamGet>({
    PageIndex: 1,
    PageSize: 7,
  } as SParamGet);

  const [customerSelectParamGet, setCustomerSelectParamGet] =
    useState<ParamGet>({
      PageIndex: 1,
      PageSize: 6,
    } as ParamGet);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [serverAllocationUpdate, setServerAllocationUpdate] = useState<
    ServerAllocation | undefined
  >(undefined);
  const [serverAllocationAlert, setServerAllocationAlert] = useState<
    ServerAllocation | undefined
  >(undefined);
  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);

  const getData = async () => {
    var customerId = "",
      userId = "";
    if (areInArray(session?.user.roles!, ROLE_SALES)) {
      userId = parseJwt(session?.user.access_token!).UserId;
    } else if (session?.user.roles.includes("Customer")) {
      customerId = parseJwt(session.user.access_token).UserId;
    }
    dispatch(
      getServerAllocationData({
        token: session?.user.access_token!,
        param: {
          ...paramGet,
          CustomerId: customerId,
          Status: status,
          UserId: userId,
        },
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

  const updateData = async (data: SAUpdateModel) => {
    await serverAllocationService
      .updateServerAllocation(session?.user.access_token!, data)
      .then((res) => {
        message.success("Update successfully!", 1.5);
        getData();
      })
      .catch((errors) => {
        message.error(errors.response.data, 1.5);
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
            message.success(`Delete server allocation successfully!`, 1.5);
          })
          .catch((errors) => {
            message.error(
              errors.response.data ?? "Delete allocation failed",
              1.5
            );
            setLoadingSubmit(false);
          });
      },
      onCancel() {},
    });
  };

  const handleChange = (value) => {
    switch (value) {
      case "0":
        setStatus(undefined);
        break;
      case "1":
        setStatus("Waiting");
        break;
      case "2":
        setStatus("Working");
        break;
      case "3":
        setStatus("Pausing");
        break;
      case "4":
        setStatus("Removed");
        break;
    }
  };

  useEffect(() => {
    session && getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

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

  const items: TabsProps["items"] = [
    {
      key: "0",
      label: "All",
    },
    {
      key: "1",
      label: "Waiting",
    },
    {
      key: "2",
      label: "Working",
    },
    {
      key: "3",
      label: "Pausing",
    },
    {
      key: "4",
      label: "Removed",
    },
  ];

  return (
    <AntdLayoutNoSSR
      content={
        <>
          <div className="flex justify-between mb-4 p-2 bg-[#f8f9fa]/10 border border-gray-200 rounded-lg shadow-lg shadow-[#e7edf5]/50">
            {areInArray(session?.user.roles!, ROLE_CUSTOMER) && (
              <Button
                type="primary"
                htmlType="submit"
                className="mb-2"
                onClick={() => {
                  setOpenModalCreate(true);
                }}
              >
                Create
              </Button>
            )}
            {!areInArray(session?.user.roles!, ROLE_CUSTOMER) && (
              <div className="flex-grow"></div>
            )}
            <SearchComponent
              placeholder="Search Name, Description..."
              setSearchValue={(value) =>
                setParamGet({ ...paramGet, SearchValue: value })
              }
            />
          </div>
          <Tabs
            className="m-5"
            defaultActiveKey="0"
            items={items}
            centered
            onTabClick={(value) => handleChange(value)}
          />
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
                onAlert={(record) => {
                  setServerAllocationAlert(record);
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
              <ModalAlert
                serverAllocation={serverAllocationAlert!}
                onClose={() => setServerAllocationAlert(undefined)}
                onSubmit={() => {
                  setServerAllocationAlert(undefined);
                  getData();
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
