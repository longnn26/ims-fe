"use client";
import BreadcrumbComponent from "@components/BreadcrumbComponent";
import ServerDetail from "@components/server/ServerDetail";
import RequestExpandDetailInfor from "@components/server/requestExpand/RequestExpandDetail";
import { RequestExpand } from "@models/requestExpand";
import { ServerAllocation } from "@models/serverAllocation";
import requestExpandService from "@services/requestExpand";
import serverAllocationService from "@services/serverAllocation";
import { Alert, FloatButton, Modal, message } from "antd";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { AiOutlineFileDone } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
const { confirm } = Modal;
const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});
const RequestExpandDetail: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [serverAllocationDetail, setServerAllocationDetail] =
    useState<ServerAllocation>();

  const [requestExpandDetail, setRequestExpandDetail] =
    useState<RequestExpand>();

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

    await requestExpandService
      .getDetail(session?.user.access_token!, router.query.requestExpandId + "")
      .then((res) => {
        setRequestExpandDetail(res);
      });
  };

  const denyRequestExpand = async () => {
    confirm({
      title: "Deny",
      content: (
        <Alert
          message={`Do you want to deny with Id ${requestExpandDetail?.id}?`}
          type="warning"
        />
      ),
      async onOk() {
        await requestExpandService
          .rejectRequestExpand(
            session?.user.access_token!,
            requestExpandDetail?.id + ""
          )
          .then((res) => {
            message.success("Deny request expand successful!");
            getData();
          })
          .catch((errors) => {
            message.error(errors.message);
          })
          .finally(() => {});
      },
      onCancel() {},
    });
  };

  const acceptRequestExpand = async () => {
    confirm({
      title: "Accept",
      content: (
        <Alert
          message={`Do you want to accept with Id ${requestExpandDetail?.id}?`}
          type="warning"
        />
      ),
      async onOk() {
        await requestExpandService
          .acceptRequestExpand(
            session?.user.access_token!,
            requestExpandDetail?.id + ""
          )
          .then((res) => {
            message.success("Accept request expand successful!");
            getData();
          })
          .catch((errors) => {
            message.error(errors.message);
          })
          .finally(() => {});
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
      getData();
      handleBreadCumb();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return (
    <AntdLayoutNoSSR
      content={
        <>
          <div className="flex flex-wrap items-center justify-between mb-4 p-2 bg-[#f8f9fa]/10 border border-gray-200 rounded-lg shadow-lg shadow-[#e7edf5]/50">
            <BreadcrumbComponent itemBreadcrumbs={itemBreadcrumbs} />
          </div>
          <div className="md:flex">
            <ServerDetail
              serverAllocationDetail={serverAllocationDetail!}
            ></ServerDetail>
            <RequestExpandDetailInfor
              requestExpandDetail={requestExpandDetail!}
            />
          </div>
          {Boolean(requestExpandDetail?.status === "Waiting") && (
            <FloatButton.Group
              trigger="hover"
              type="primary"
              style={{ right: 60, bottom: 500 }}
              icon={<AiOutlineFileDone />}
            >
              <FloatButton
                icon={<MdCancel color="red" />}
                tooltip="Deny"
                onClick={() => denyRequestExpand()}
              />
              <FloatButton
                onClick={() => acceptRequestExpand()}
                icon={<AiOutlineFileDone color="green" />}
                tooltip="Accept"
              />
            </FloatButton.Group>
          )}
        </>
      }
    />
  );
};

export default RequestExpandDetail;
