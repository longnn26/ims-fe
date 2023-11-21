"use client";
import BreadcrumbComponent from "@components/BreadcrumbComponent";
import AppointmentTable from "@components/server/requestUpgrade/AppointmentTable";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import { RUAppointmentParamGet, RequestUpgrade } from "@models/requestUpgrade";
import { ServerAllocation } from "@models/serverAllocation";
import requestUpgradeService from "@services/requestUpgrade";
import serverAllocationService from "@services/serverAllocation";
import { getAppointmentData } from "@slices/requestUpgrade";
import { dateAdvFormat } from "@utils/constants";
import { Descriptions, Divider, Pagination } from "antd";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import moment from "moment";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});
const RequestDetail: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: session } = useSession();
  const { appointmentData } = useSelector((state) => state.requestUpgrade);

  const [serverAllocationDetail, setServerAllocationDetail] =
    useState<ServerAllocation>();

  const [requestUpgradeDetail, setRequestUpgradeDetail] =
    useState<RequestUpgrade>();

  const [itemBreadcrumbs, setItemBreadcrumbs] = useState<ItemType[]>([]);
  const [rUAppointmentParamGet, setRUAppointmentParamGet] =
    useState<RUAppointmentParamGet>({
      PageIndex: 1,
      PageSize: 10,
      RequestUpgradeId: router.query.requestId ?? -1,
    } as unknown as RUAppointmentParamGet);

  const getData = async () => {
    await requestUpgradeService
      .getDetail(session?.user.access_token!, router.query.requestId + "")
      .then(async (res) => {
        await serverAllocationService
          .getServerAllocationById(
            session?.user.access_token!,
            res.serverAllocationId + ""
          )
          .then((res) => {
            setServerAllocationDetail(res);
          });
        setRequestUpgradeDetail(res);
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
    if (router.query.requestId && session) {
      getData();
      handleBreadCumb();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  useEffect(() => {
    if (router.query.requestId && session) {
      rUAppointmentParamGet.Id = parseInt(router.query.requestId!.toString());
      dispatch(
        getAppointmentData({
          token: session?.user.access_token!,
          paramGet: { ...rUAppointmentParamGet },
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, rUAppointmentParamGet]);

  return (
    <AntdLayoutNoSSR
      content={
        <>
          <div className="flex flex-wrap items-center justify-between mb-4 p-2 bg-[#f8f9fa]/10 border border-gray-200 rounded-lg shadow-lg shadow-[#e7edf5]/50">
            <BreadcrumbComponent itemBreadcrumbs={itemBreadcrumbs} />
          </div>
          {/* Server Information */}
          <Divider orientation="left" plain>
            <h3>Server </h3>
          </Divider>{" "}
          <Descriptions className="p-5">
            <Descriptions.Item label="Id">
              {serverAllocationDetail?.id}
            </Descriptions.Item>
            <Descriptions.Item label="Note">
              {serverAllocationDetail?.note}
            </Descriptions.Item>
            <Descriptions.Item label="Expected Size">
              {serverAllocationDetail?.expectedSize}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {serverAllocationDetail?.status}
            </Descriptions.Item>
            <Descriptions.Item label="Inspector Note">
              {serverAllocationDetail?.inspectorNote}
            </Descriptions.Item>
            <Descriptions.Item label="Date Created">
              {moment(serverAllocationDetail?.dateCreated).format(
                dateAdvFormat
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Date Updated">
              {moment(serverAllocationDetail?.dateUpdated).format(
                dateAdvFormat
              )}
            </Descriptions.Item>
          </Descriptions>
          {/* Request upgrade information */}
          <Divider orientation="left" plain>
            <h3>Request upgrade information </h3>
          </Divider>{" "}
          <Descriptions className="p-5">
            <Descriptions.Item label="Id">
              {requestUpgradeDetail?.id}
            </Descriptions.Item>
            <Descriptions.Item label="Capacity">
              {requestUpgradeDetail?.capacity}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {requestUpgradeDetail?.status}
            </Descriptions.Item>
            <Descriptions.Item label="Component">
              {requestUpgradeDetail?.componentId}
            </Descriptions.Item>
            <Descriptions.Item label="Date Created">
              {moment(serverAllocationDetail?.dateCreated).format(
                dateAdvFormat
              )}
            </Descriptions.Item>
          </Descriptions>
          <AppointmentTable
            onEdit={(record) => {}}
            onDelete={async (record) => {}}
          />
          {appointmentData?.totalPage > 0 && (
            <Pagination
              className="text-end m-4"
              current={rUAppointmentParamGet?.PageIndex}
              pageSize={appointmentData?.pageSize ?? 10}
              total={appointmentData?.totalSize}
              onChange={(page, pageSize) => {
                setRUAppointmentParamGet({
                  ...rUAppointmentParamGet,
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

export default RequestDetail;
