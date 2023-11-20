"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import React from "react";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import { getserverHardwareConfigData } from "@slices/serverHardwareConfig";
import {
  SHCCreateModel,
  SHCParamGet,
  SHCUpdateModel,
  ServerHardwareConfig,
  ServerHardwareConfigData,
} from "@models/serverHardwareConfig";
import {
  Button,
  Pagination,
  message,
  Modal,
  Alert,
  Descriptions,
  Divider,
  FloatButton,
} from "antd";
import type { DescriptionsProps } from "antd";
import ServerHardwareConfigTable from "@components/server/hardwareConfig/ServerHardwareConfigTable";
import serverHardwareConfigService from "@services/serverHardwareConfig";
import serverAllocationService from "@services/serverAllocation";
import { useRouter } from "next/router";
import { ServerAllocation } from "@models/serverAllocation";
import { dateAdvFormat } from "@utils/constants";
import { AppstoreAddOutlined, SendOutlined } from "@ant-design/icons";
import moment from "moment";
import ModalCreate from "@components/server/hardwareConfig/ModalCreate";
import ModalUpdate from "@components/server/hardwareConfig/ModalUpdate";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import BreadcrumbComponent from "@components/BreadcrumbComponent";
import { getComponentAll } from "@slices/component";
const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});
var itemDetails: DescriptionsProps["items"] = [];
var itemBreadcrumbs: ItemType[] = [];
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
  const getData = async () => {
    await serverAllocationService
      .getServerAllocationById(
        session?.user.access_token!,
        router.query.serverAllocationId + ""
      )
      .then((res) => {
        itemDetails = [];
        itemDetails?.push({
          key: "1",
          label: "Id",
          children: res.id,
        });
        itemDetails?.push({
          key: "2",
          label: "Note",
          children: res.note,
        });
        itemDetails?.push({
          key: "3",
          label: "ExpectedSize",
          children: res.expectedSize,
        });
        itemDetails?.push({
          key: "4",
          label: "Status",
          children: res.status,
        });
        itemDetails?.push({
          key: "5",
          label: "InspectorNote",
          children: res.inspectorNote,
        });
        itemDetails?.push({
          key: "6",
          label: "Date created",
          children: moment(res.dateCreated).format(dateAdvFormat),
        });
        itemDetails?.push({
          key: "7",
          label: "Date updated",
          children: moment(res.dateUpdated).format(dateAdvFormat),
        });
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
    itemBreadcrumbs = [];
    var items = router.asPath.split("/").filter((_) => _ != "");
    var path = "";
    items.forEach((element) => {
      path += `/${element}`;
      itemBreadcrumbs.push({
        href: path,
        title: element,
      });
    });
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
            {/* <SearchComponent
              placeholder="Search Name, Description..."
              setSearchValue={(value) =>
                setParamGet({ ...paramGet, SearchValue: value })
              }
            /> */}
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
          <Divider orientation="left" plain>
            <h3>Server Information</h3>
          </Divider>{" "}
          <Descriptions className="p-5" items={itemDetails} />
          <ServerHardwareConfigTable
            onEdit={(record) => {
              setServerHardwareConfigUpdate(record);
            }}
            onDelete={async (record) => {
              deleteData(record);
            }}
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
          <FloatButton
            type="primary"
            tooltip="Request upgrade"
            icon={<SendOutlined />}
            style={{ top: 300 }}
            // className="top-[100]"
            onClick={() =>
              router.push(`/server/${itemDetails![0].children}/requestUpgrade`)
            }
          />
        </>
      }
    />
  );
};

export default Customer;
