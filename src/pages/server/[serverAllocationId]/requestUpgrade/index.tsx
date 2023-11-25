"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import React from "react";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import { getRequestUpgradeData } from "@slices/requestUpgrade";
import {
  RequestUpgradeCreateModel,
  RequestUpgrade,
  RequestUpgradeData,
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
import { dateAdvFormat } from "@utils/constants";
import { IoIosSend } from "react-icons/io";
import moment from "moment";
import ModalCreate from "@components/server/requestUpgrade/ModalCreate";
import ModalUpdate from "@components/server/requestUpgrade/ModalUpdate";
import RequestUpgradeTable from "@components/server/requestUpgrade/RequestUpgradeTable";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import BreadcrumbComponent from "@components/BreadcrumbComponent";
import ServerDetail from "@components/server/ServerDetail";
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
  const [serverAllocationDetail, setServerAllocationDetail] =
    useState<ServerAllocation>();

  const [itemBreadcrumbs, setItemBreadcrumbs] = useState<ItemType[]>([]);

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
      getRequestUpgradeData({
        token: session?.user.access_token!,
        paramGet: { ...paramGet },
      })
    ).then(({ payload }) => {
      var res = payload as RequestUpgradeData;
      if (res?.totalPage < paramGet.PageIndex && res.totalPage != 0) {
        setParamGet({ ...paramGet, PageIndex: res.totalPage });
      }
    });
  };

  const createData = async (data: RequestUpgradeCreateModel) => {
    await requestUpgradeService
      .createData(session?.user.access_token!, data)
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

  const updateData = async (data: RequestUpgradeUpdateModel) => {
    await requestUpgradeService
      .updateData(session?.user.access_token!, data)
      .then((res) => {
        message.success("Update successful!");
        getData();
      })
      .catch((errors) => {
        message.error(errors.message);
      })
      .finally(() => {
        setRequestUpgradeUpdate(undefined);
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
            message.success(`Delete request upgrade successful`);
          })
          .catch((errors) => {
            message.error(errors.message ?? "Delete request upgrade failed");
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
              icon={<IoIosSend />}
              onClick={() => {
                setOpenModalCreate(true);
              }}
            >
              Request upgrade
            </Button>

            {/* <SearchComponent
              placeholder="Search Name, Description..."
              setSearchValue={(value) =>
                setParamGet({ ...paramGet, SearchValue: value })
              }
            /> */}
          </div>
          <ModalUpdate
            requestUpgrade={requestUpgradeUpdate!}
            onClose={() => setRequestUpgradeUpdate(undefined)}
            onSubmit={(data: RequestUpgradeUpdateModel) => {
              updateData(data);
            }}
          />
          <ModalCreate
            open={openModalCreate}
            onClose={() => setOpenModalCreate(false)}
            onSubmit={(data: RequestUpgradeCreateModel) => {
              data.serverAllocationId = parseInt(
                router.query!.serverAllocationId!.toString()
              );
              createData(data);
            }}
          />
          <ServerDetail
            serverAllocationDetail={serverAllocationDetail!}
          ></ServerDetail>
          <RequestUpgradeTable
            urlOncell={`/server/${serverAllocationDetail?.id}`}
            serverAllocationId={serverAllocationDetail?.id.toString()}
            onEdit={(record) => {
              setRequestUpgradeUpdate(record);
            }}
            onDelete={async (record) => {
              deleteData(record);
            }}
          />
          {requestUpgradeData.totalPage > 0 && (
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
      }
    />
  );
};

export default RequestUpgrade;
