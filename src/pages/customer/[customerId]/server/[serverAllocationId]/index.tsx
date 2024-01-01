"use client";
import { AppstoreAddOutlined, SendOutlined } from "@ant-design/icons";
import BreadcrumbComponent from "@components/BreadcrumbComponent";
import ServerDetail from "@components/server/ServerDetail";
import ModalCreate from "@components/server/hardwareConfig/ModalCreate";
import ModalUpdate from "@components/server/hardwareConfig/ModalUpdate";
import ServerHardwareConfigTable from "@components/server/hardwareConfig/ServerHardwareConfigTable";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import { ServerAllocation } from "@models/serverAllocation";
import {
  SHCCreateModel,
  SHCParamGet,
  SHCUpdateModel,
  ServerHardwareConfig,
  ServerHardwareConfigData,
} from "@models/serverHardwareConfig";
import serverAllocationService from "@services/serverAllocation";
import serverHardwareConfigService from "@services/serverHardwareConfig";
import ipAddressService from "@services/ipAddress";
import { getComponentAll } from "@slices/component";
import { Alert, Button, FloatButton, Modal, Pagination, message } from "antd";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { MdUpgrade } from "react-icons/md";
import { FaExpand } from "react-icons/fa";
import { IpAddress, IpAddressData, IpAddressParamGet } from "@models/ipAddress";
import ModalAssign from "@components/server/ipAddress/ModalAssign";
import { BsFillHddNetworkFill } from "react-icons/bs";
import { GrHost } from "react-icons/gr";
import { RUIpAdressParamGet } from "@models/requestHost";
import { getServerIpAdressData } from "@slices/serverAllocation";
import IpAddressTable from "@components/server/ipAddress/IpAddressTable";
import { ROLE_CUSTOMER, ROLE_SALES, ROLE_TECH } from "@utils/constants";
import { areInArray } from "@utils/helpers";
import ModalEmpty from "@components/ModalEmpty";
import customerService from "@services/customer";
import { Customer } from "@models/customer";
import serverHardwareConfig from "@services/serverHardwareConfig";

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});
const { confirm } = Modal;
const Customer: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: session } = useSession();
  const { serverIpAdressData } = useSelector((state) => state.serverAllocation);

  const [paramGet, setParamGet] = useState<SHCParamGet>({
    PageIndex: 1,
    PageSize: 10,
    ServerAllocationId: router.query.serverAllocationId ?? -1,
  } as unknown as SHCParamGet);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [serverHardwareConfigUpdate, setServerHardwareConfigUpdate] = useState<
    ServerHardwareConfig | undefined
  >(undefined);
  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
  const [serverAllocationDetail, setServerAllocationDetail] =
    useState<ServerAllocation>();
  const [itemBreadcrumbs, setItemBreadcrumbs] = useState<ItemType[]>([]);
  const [ipSuggestMaster, setIpSuggestMaster] = useState<IpAddress>();
  const [permission, setPermission] = useState<boolean>(true);
  const [content, setContent] = useState<string>("");
  const [customerDetail, setCustomerDetail] = useState<Customer>();
  const [hardware, setHardware] = useState<ServerHardwareConfigData>();

  const [ipAddressParamGet, setIpAddressParamGet] =
    useState<IpAddressParamGet>({
      PageIndex: 1,
      PageSize: 10,
      ServerAllocationId: router.query.serverAllocationId ?? -1,
    } as unknown as IpAddressParamGet);

  const getData = async () => {
    await serverAllocationService
      .getServerAllocationById(
        session?.user.access_token!,
        router.query.serverAllocationId + ""
      )
      .then((res) => {
        setServerAllocationDetail(res);
      })
      .catch((errors) => {
        setContent(errors.response.data);
      });
    await serverHardwareConfig.getServerHardwareConfigData(
      session?.user.access_token!,
      paramGet
    ).then((res) => {
      setHardware(res);
    });
    dispatch(
      getServerIpAdressData({
        token: session?.user.access_token!,
        paramGet: { ...ipAddressParamGet, IsAssigned: true },
      })
    ).then(({ payload }) => {
      var res = payload as IpAddressData;
      if (
        res &&
        res.totalPage < ipAddressParamGet.PageIndex &&
        res.totalPage != 0
      ) {
        setIpAddressParamGet({
          ...ipAddressParamGet,
          PageIndex: res.totalPage,
        });
      }
    });
    await customerService
      .getCustomerById(
        session?.user.access_token!,
        router.query.customerId + ""
      )
      .then(async (res) => {
        setCustomerDetail(res);
      })
      .catch((errors) => {
        setCustomerDetail(undefined);
        setContent("Customer NOT EXISTED");
      });
  };

  const checkPermission = () => {
    if (serverAllocationDetail?.customer.id !== router.query.customerId) {
      setPermission(false);
    } else {
      setPermission(true);
    }
  };

  // const createData = async (data: SHCCreateModel) => {
  //   await serverHardwareConfigService
  //     .createServerHardwareConfig(session?.user.access_token!, data)
  //     .then((res) => {
  //       message.success("Create successfully!");
  //       getData();
  //     })
  //     .catch((errors) => {
  //       message.error(errors.response.data);
  //     })
  //     .finally(() => {
  //       setOpenModalCreate(false);
  //     });
  // };

  const updateData = async (data: SHCUpdateModel) => {
    await serverHardwareConfigService
      .updateServerHardwareConfig(session?.user.access_token!, data)
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

  const deleteData = (serverHardwareConfig: ServerHardwareConfig) => {
    confirm({
      title: "Delete",
      content: (
        <Alert
          message={`Do you want to delete with Id ${serverHardwareConfig.id}?`}
          // description={`${serverAllocation.id}`}
          type="warning"
        />
      ),
      async onOk() {
        setLoadingSubmit(true);
        await serverHardwareConfigService
          .deleteServerHardwareConfig(
            session?.user.access_token!,
            serverHardwareConfig.id.toString()
          )
          .then(() => {
            getData();
            message.success(`Delete hardware config successfully`);
          })
          .catch((errors) => {
            message.error(
              errors.response.data ?? "Delete hardware config failed"
            );
            setLoadingSubmit(false);
          });
      },
      onCancel() { },
    });
  };

  const handleBreadCumb = () => {
    var itemBrs = [] as ItemType[];
    var items = router.asPath.split("/").filter((_) => _ != "");
    var path = "";
    items.forEach((element) => {
      if (element === customerDetail?.id) {
        path += `/${element}`;
        itemBrs.push({
          href: path,
          title: customerDetail?.companyName,
        });
      } else {
        path += `/${element}`;
        itemBrs.push({
          href: path,
          title: element,
        });
      }
    });
    setItemBreadcrumbs(itemBrs);
  };

  const getIpSuggestMaster = async () => {
    await ipAddressService
      .getSuggestMaster(session?.user.access_token!)
      .then((res) => {
        setIpSuggestMaster(res);
      })
      .catch((errors) => {
        // message.error(errors.response.data);
      })
      .finally(() => { });
  };

  useEffect(() => {
    if (router.query.customerId && session) {
      handleBreadCumb();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerDetail]);

  useEffect(() => {
    if (router.query.serverAllocationId && session) {
      paramGet.ServerAllocationId = parseInt(
        router.query.serverAllocationId!.toString()
      );
      ipAddressParamGet.ServerAllocationId = parseInt(
        router.query.serverAllocationId!.toString()
      );
      getData();
      handleBreadCumb();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, paramGet, ipAddressParamGet, router.query.serverAllocationId]);

  useEffect(() => {
    if (router.query.serverAllocationId && session) {
      checkPermission();
      handleBreadCumb();
    }
  }, [serverAllocationDetail]);

  if (serverAllocationDetail === undefined || customerDetail === undefined) {
    return (
      <AntdLayoutNoSSR
        content={
          <>
            <ModalEmpty isPermission={false} content={content} />
          </>
        }
      />
    );
  } else
    return (
      <AntdLayoutNoSSR
        content={
          <>
            {!permission ? (
              <ModalEmpty isPermission={true} content={content} />
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-between mb-4 p-2 bg-[#f8f9fa]/10 border border-gray-200 rounded-lg shadow-lg shadow-[#e7edf5]/50">
                  <BreadcrumbComponent itemBreadcrumbs={itemBreadcrumbs} />
                  <div>
                    {Boolean(
                      !serverAllocationDetail?.masterIp?.address &&
                      serverAllocationDetail?.status !== "Removed" &&
                      areInArray(session?.user.roles!, ROLE_TECH)
                    ) && (
                        <Button
                          type="primary"
                          htmlType="submit"
                          className="mr-2"
                          icon={<BsFillHddNetworkFill />}
                          onClick={() => {
                            getIpSuggestMaster();
                          }}
                        >
                          Assign IP
                        </Button>
                      )}
                    {Boolean(
                      serverAllocationDetail?.status !== "Removed" &&
                      areInArray(session?.user.roles!, ROLE_TECH)
                    ) && (
                        <Button
                          type="primary"
                          htmlType="submit"
                          icon={<AppstoreAddOutlined />}
                          onClick={() => {
                            setOpenModalCreate(true);
                          }}
                        >
                          Hardware Config
                        </Button>
                      )}
                  </div>
                </div>
                <ModalCreate
                  open={openModalCreate}
                  onClose={() => setOpenModalCreate(false)}
                  onSubmit={() => {
                    setOpenModalCreate(false);
                    getData();
                  }}
                />
                <ModalUpdate
                  open={openModalUpdate}
                  serverHardwareConfig={serverHardwareConfigUpdate!}
                  onClose={() => {
                    setServerHardwareConfigUpdate(undefined);
                    setOpenModalUpdate(false);
                  }}
                  onSubmit={(data: SHCUpdateModel) => {
                    data.serverAllocationId = parseInt(
                      router.query!.serverAllocationId!.toString()
                    );
                    updateData(data);
                  }}
                />
                {areInArray(
                  session?.user.roles!,
                  ROLE_TECH,
                  ROLE_SALES,
                  ROLE_CUSTOMER
                ) && (
                    <>
                      <ServerDetail
                        serverAllocationDetail={serverAllocationDetail!}
                        hardware={hardware!}
                      />

                      <IpAddressTable typeGet="ServerAllocation" />
                      {serverIpAdressData?.totalPage > 0 && (
                        <Pagination
                          className="text-end m-4"
                          current={ipAddressParamGet?.PageIndex}
                          pageSize={serverIpAdressData?.pageSize ?? 10}
                          total={serverIpAdressData?.totalSize}
                          onChange={(page, pageSize) => {
                            setIpAddressParamGet({
                              ...ipAddressParamGet,
                              PageIndex: page,
                              PageSize: pageSize,
                            });
                          }}
                        />
                      )}
                      <ModalAssign
                        id={serverAllocationDetail?.id!}
                        ipSuggestMaster={ipSuggestMaster}
                        onClose={() => setIpSuggestMaster(undefined)}
                        onRefresh={() => {
                          getData();
                        }}
                      />
                      <FloatButton.Group
                        trigger="hover"
                        type="primary"
                        style={{ right: 60, bottom: 400 }}
                        icon={<SendOutlined />}
                      >
                        <FloatButton
                          tooltip="Request upgrade"
                          icon={<MdUpgrade />}
                          onClick={() =>
                            router.push(
                              `/customer/${serverAllocationDetail.customer.id}/server/${serverAllocationDetail?.id}/requestUpgrade`
                            )
                          }
                        />
                        <FloatButton
                          onClick={() =>
                            router.push(
                              `/customer/${serverAllocationDetail.customer.id}/server/${serverAllocationDetail?.id}/requestExpand`
                            )
                          }
                          icon={<FaExpand />}
                          tooltip="Request expand"
                        />
                        <FloatButton
                          tooltip="IP Request"
                          icon={<GrHost />}
                          onClick={() =>
                            router.push(
                              `/customer/${serverAllocationDetail.customer.id}/server/${serverAllocationDetail?.id}/requestHost`
                            )
                          }
                        />
                      </FloatButton.Group>
                    </>
                  )}
              </>
            )}
            ;
          </>
        }
      />
    );
};

export default Customer;
