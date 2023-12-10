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
import { getserverHardwareConfigData } from "@slices/serverHardwareConfig";
import { Alert, Button, FloatButton, Modal, Pagination, message } from "antd";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { MdUpgrade } from "react-icons/md";
import { FaExpand } from "react-icons/fa";
import { IpAddress } from "@models/ipAddress";
import ModalAssign from "@components/server/ipAddress/ModalAssign";
import { BsFillHddNetworkFill } from "react-icons/bs";
import { GrHost } from "react-icons/gr";

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});
const { confirm } = Modal;
const Customer: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: session } = useSession();
  const { serverHardwareConfigData } = useSelector(
    (state) => state.serverHardwareConfig
  );

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
  const [serverAllocationDetail, setServerAllocationDetail] =
    useState<ServerAllocation>();
  const [itemBreadcrumbs, setItemBreadcrumbs] = useState<ItemType[]>([]);
  const [ipSuggestMaster, setIpSuggestMaster] = useState<IpAddress>();

  const getData = async () => {
    await serverAllocationService
      .getServerAllocationById(
        session?.user.access_token!,
        router.query.serverAllocationId + ""
      )
      .then((res) => {
        setServerAllocationDetail(res);
      });
    dispatch(
      getserverHardwareConfigData({
        token: session?.user.access_token!,
        paramGet: { ...paramGet },
      })
    ).then(({ payload }) => {
      var res = payload as ServerHardwareConfigData;
      if (res.totalPage < paramGet.PageIndex && res.totalPage != 0) {
        setParamGet({ ...paramGet, PageIndex: res.totalPage });
      }
    });
    dispatch(getComponentAll({ token: session?.user.access_token! }));
  };

  const createData = async (data: SHCCreateModel) => {
    await serverHardwareConfigService
      .createServerHardwareConfig(session?.user.access_token!, data)
      .then((res) => {
        message.success("Create successful!");
        getData();
      })
      .catch((errors) => {
        message.error(errors.response.data);
      })
      .finally(() => {
        setOpenModalCreate(false);
      });
  };

  const updateData = async (data: SHCUpdateModel) => {
    await serverHardwareConfigService
      .updateServerHardwareConfig(session?.user.access_token!, data)
      .then((res) => {
        message.success("Update successful!");
        getData();
      })
      .catch((errors) => {
        message.error(errors.message);
      })
      .finally(() => {
        setServerHardwareConfigUpdate(undefined);
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
            message.success(`Delete hardware config successful`);
          })
          .catch((errors) => {
            message.error(errors.message ?? "Delete hardware config failed");
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
      path += `/${element}`;
      itemBrs.push({
        href: path,
        title: element,
      });
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
      .finally(() => {});
  };

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
            <BreadcrumbComponent itemBreadcrumbs={itemBreadcrumbs} />
            <div>
              {!serverAllocationDetail?.masterIp?.address && (
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
            </div>
          </div>
          <ModalUpdate
            serverHardwareConfig={serverHardwareConfigUpdate!}
            onClose={() => setServerHardwareConfigUpdate(undefined)}
            onSubmit={(data: SHCUpdateModel) => {
              updateData(data);
            }}
          />
          <ModalCreate
            open={openModalCreate}
            onClose={() => setOpenModalCreate(false)}
            onSubmit={(data: SHCCreateModel) => {
              data.serverAllocationId = parseInt(
                router.query!.serverAllocationId!.toString()
              );
              createData(data);
            }}
          />
          <ServerDetail
            serverAllocationDetail={serverAllocationDetail!}
          ></ServerDetail>
          <ServerHardwareConfigTable
            onEdit={(record) => {
              setServerHardwareConfigUpdate(record);
            }}
            onDelete={async (record) => {
              deleteData(record);
            }}
            serverStatus={serverAllocationDetail?.status}
          />
          {serverHardwareConfigData.totalPage > 0 && (
            <Pagination
              className="text-end m-4"
              current={paramGet.PageIndex}
              pageSize={serverHardwareConfigData.pageSize ?? 10}
              total={serverHardwareConfigData.totalSize}
              onChange={(page, pageSize) => {
                setParamGet({
                  ...paramGet,
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
                  `/server/${serverAllocationDetail?.id}/requestUpgrade`
                )
              }
            />
            <FloatButton
              onClick={() =>
                router.push(
                  `/server/${serverAllocationDetail?.id}/requestExpand`
                )
              }
              icon={<FaExpand />}
              tooltip="Request expand"
            />
            <FloatButton
              tooltip="Request host"
              icon={<GrHost />}
              onClick={() =>
                router.push(`/server/${serverAllocationDetail?.id}/requestHost`)
              }
            />
          </FloatButton.Group>
        </>
      }
    />
  );
};

export default Customer;
