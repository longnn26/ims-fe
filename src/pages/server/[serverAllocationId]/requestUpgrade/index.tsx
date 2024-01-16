"use client";
import dynamic from "next/dynamic";
import { AppstoreAddOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import React from "react";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import { getRequestUpgradeData } from "@slices/requestUpgrade";
import {
  RequestUpgrade,
  RequestUpgradeCreateModel,
  RequestUpgradeData,
  RequestUpgradeRemoveModel,
  RequestUpgradeUpdateModel,
  RUParamGet,
} from "@models/requestUpgrade";
import {
  Button,
  Pagination,
  message,
  Modal,
  Alert,
  Descriptions,
  Divider,
} from "antd";
import type { DescriptionsProps } from "antd";
import { CaretLeftOutlined } from "@ant-design/icons";
import requestUpgradeService from "@services/requestUpgrade";
import serverAllocationService from "@services/serverAllocation";
import { useRouter } from "next/router";
import { ServerAllocation } from "@models/serverAllocation";
import {
  ROLE_CUSTOMER,
  ROLE_MANAGER,
  ROLE_SALES,
  ROLE_TECH,
  dateAdvFormat,
} from "@utils/constants";
import { IoIosSend } from "react-icons/io";
import moment from "moment";
import ModalCreate from "@components/server/requestUpgrade/ModalCreate";
import ModalUpdate from "@components/server/requestUpgrade/ModalUpdate";
import RequestUpgradeTable from "@components/server/requestUpgrade/RequestUpgradeTable";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import BreadcrumbComponent from "@components/BreadcrumbComponent";
import ServerDetail from "@components/server/ServerDetail";
import { areInArray, parseJwt } from "@utils/helpers";
import ModalRemove from "@components/server/requestUpgrade/ModalRemove";
import {
  SHCParamGet,
  ServerHardwareConfigData,
} from "@models/serverHardwareConfig";
import serverHardwareConfig from "@services/serverHardwareConfig";
const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});
const { confirm } = Modal;
const RequestUpgrade: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: session } = useSession();
  const { requestUpgradeData } = useSelector((state) => state.requestUpgrade);

  const [paramGet, setParamGet] = useState<RUParamGet>({
    PageIndex: 1,
    PageSize: 10,
    ServerAllocationId: router.query.serverAllocationId ?? -1,
  } as unknown as RUParamGet);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [requestUpgradeUpdate, setRequestUpgradeUpdate] = useState<
    RequestUpgrade | undefined
  >(undefined);
  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
  const [openModalRemove, setOpenModalRemove] = useState<boolean>(false);
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
  const [serverAllocationDetail, setServerAllocationDetail] =
    useState<ServerAllocation>();
  const [hardware, setHardware] = useState<ServerHardwareConfigData>();
  const [itemBreadcrumbs, setItemBreadcrumbs] = useState<ItemType[]>([]);

  const getData = async () => {
    var customerId = "",
      userId = "";
    if (areInArray(session?.user.roles!, ROLE_SALES)) {
      userId = parseJwt(session?.user.access_token!).UserId;
    } else if (session?.user.roles.includes("Customer")) {
      customerId = parseJwt(session.user.access_token).UserId;
    }
    await serverAllocationService
      .getServerAllocationById(
        session?.user.access_token!,
        router.query.serverAllocationId + ""
      )
      .then((res) => {
        setServerAllocationDetail(res);
      });
    await serverHardwareConfig
      .getServerHardwareConfigData(session?.user.access_token!, {
        ...paramGet,
        ServerAllocationId: parseInt(router.query.serverAllocationId + ""),
      } as SHCParamGet)
      .then((res) => {
        setHardware(res);
      });
    dispatch(
      getRequestUpgradeData({
        token: session?.user.access_token!,
        paramGet: { ...paramGet, CustomerId: customerId, UserId: userId },
      })
    ).then(({ payload }) => {
      var res = payload as RequestUpgradeData;
      if (res?.totalPage < paramGet.PageIndex && res.totalPage != 0) {
        setParamGet({ ...paramGet, PageIndex: res.totalPage });
      }
    });
  };

  const removeData = async (data: RequestUpgradeRemoveModel) => {
    await requestUpgradeService
      .removeData(session?.user.access_token!, data)
      .then((res) => {
        message.success("Remove Hardware successfully!", 1.5);
        getData();
      })
      .catch((errors) => {
        message.error(errors.response.data, 1.5);
      })
      .finally(() => {
        setOpenModalCreate(false);
      });
  };

  const deleteData = (requestUpgrade: RequestUpgrade) => {
    confirm({
      title: "Delete",
      content: (
        <Alert
          message={`Do you want to delete with Id ${requestUpgrade.id}?`}
          // description={`${serverAllocation.id}`}
          type="warning"
        />
      ),
      async onOk() {
        setLoadingSubmit(true);
        await requestUpgradeService
          .deleteData(session?.user.access_token!, requestUpgrade.id.toString())
          .then(() => {
            getData();
            message.success(`Delete request upgrade successfully`, 1.5);
          })
          .catch((errors) => {
            message.error(
              errors.response.data ?? "Delete request upgrade failed",
              1.5
            );
            setLoadingSubmit(false);
          });
      },
      onCancel() {},
    });
  };

  const handleBreadCumb = () => {
    var itemBrs = [] as ItemType[];
    var items = router.asPath.split("/").filter((_) => _ != "");
    var path = "";
    items.forEach((element) => {
      if (element !== serverAllocationDetail?.id+"") {
      path += `/${element}`;
      itemBrs.push({
        href: path,
        title: element,
      });
    } else {
      path += `/${element}`;
        itemBrs.push({
          href: path,
          title: serverAllocationDetail?.name,
        });
    }
    });
    setItemBreadcrumbs(itemBrs);
  };

  useEffect(() => {
    if (router.query.serverAllocationId && session) {
      handleBreadCumb();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverAllocationDetail]);

  useEffect(() => {
    if (router.query.serverAllocationId && session) {
      paramGet.ServerAllocationId = parseInt(
        router.query.serverAllocationId!.toString()
      );
      getData();
      handleBreadCumb();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, paramGet]);

  return (
    <AntdLayoutNoSSR
      content={
        <>
          <div className="flex flex-wrap items-center justify-between mb-4 p-2 bg-[#f8f9fa]/10 border border-gray-200 rounded-lg shadow-lg shadow-[#e7edf5]/50">
            {areInArray(
              session?.user.roles!,
              ROLE_SALES,
              ROLE_TECH,
              ROLE_CUSTOMER,
              ROLE_MANAGER
            ) && <BreadcrumbComponent itemBreadcrumbs={itemBreadcrumbs} />}
            <div>
              {areInArray(session?.user.roles!, ROLE_CUSTOMER) && (
                <>
                  {/* <Button
                    type="primary"
                    htmlType="submit"
                    className="mr-2"
                    icon={<IoIosSend />}
                    onClick={() => {
                      setOpenModalRemove(true);
                    }}
                  >
                    Hardware Remove Request
                  </Button> */}
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<IoIosSend />}
                    onClick={() => {
                      setOpenModalCreate(true);
                    }}
                  >
                    Create Hardware Upgrade Request
                  </Button>
                </>
              )}
            </div>

            {/* <SearchComponent
              placeholder="Search Name, Description..."
              setSearchValue={(value) =>
                setParamGet({ ...paramGet, SearchValue: value })
              }
            /> */}
          </div>
          <ModalUpdate
            open={openModalUpdate}
            requestUpgrade={requestUpgradeUpdate!}
            onClose={() => {
              setRequestUpgradeUpdate(undefined);
              setOpenModalUpdate(false);
            }}
            onSubmit={() => {
              setRequestUpgradeUpdate(undefined);
              setOpenModalUpdate(false);
            }}
          />
          <ModalRemove
            server={serverAllocationDetail}
            open={openModalRemove}
            onClose={() => setOpenModalRemove(false)}
            onSubmit={(data: RequestUpgradeRemoveModel) => {
              data.serverAllocationId = parseInt(
                router.query!.serverAllocationId!.toString()
              );
              removeData(data);
            }}
          />
          <ModalCreate
            open={openModalCreate}
            onClose={() => setOpenModalCreate(false)}
            onSubmit={() => {
              getData();
              setOpenModalCreate(false);
            }}
          />
          {areInArray(
            session?.user.roles!,
            ROLE_SALES,
            ROLE_TECH,
            ROLE_CUSTOMER,
            ROLE_MANAGER
          ) && (
            <>
              <ServerDetail
                serverAllocationDetail={serverAllocationDetail!}
                hardware={hardware!}
              ></ServerDetail>
              <RequestUpgradeTable
                urlOncell={`/server/${serverAllocationDetail?.id}`}
                serverAllocationId={serverAllocationDetail?.id.toString()}
                onEdit={(record) => {
                  setRequestUpgradeUpdate(record);
                  setOpenModalUpdate(true);
                }}
                onDelete={async (record) => {
                  deleteData(record);
                }}
              />
              {requestUpgradeData?.totalPage > 0 && (
                <Pagination
                  className="text-end m-4"
                  current={paramGet?.PageIndex}
                  pageSize={requestUpgradeData?.pageSize ?? 10}
                  total={requestUpgradeData?.totalSize}
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

export default RequestUpgrade;
