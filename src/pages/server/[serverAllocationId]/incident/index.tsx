"use client";
import BreadcrumbComponent from "@components/BreadcrumbComponent";
import ServerDetail from "@components/server/ServerDetail";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";

import { RUParamGet } from "@models/requestUpgrade";
import { ServerAllocation } from "@models/serverAllocation";
import serverAllocationService from "@services/serverAllocation";
import { ROLE_CUSTOMER, ROLE_SALES, ROLE_TECH } from "@utils/constants";
import { areInArray, parseJwt } from "@utils/helpers";
import { Modal, Pagination } from "antd";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  SHCParamGet,
  ServerHardwareConfigData,
} from "@models/serverHardwareConfig";
import serverHardwareConfig from "@services/serverHardwareConfig";
import { getIncidentData } from "@slices/incident";
import { IncidentData } from "@models/incident";
import IncidentTable from "@components/server/incident/IncidentTable";

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});
const { confirm } = Modal;
const Incident: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: session } = useSession();
  const { incidentData } = useSelector((state) => state.incident);

  const [paramGet, setParamGet] = useState<RUParamGet>({
    PageIndex: 1,
    PageSize: 10,
    ServerAllocationId: router.query.serverAllocationId ?? -1,
  } as unknown as RUParamGet);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [serverAllocationDetail, setServerAllocationDetail] =
    useState<ServerAllocation>();
  const [param, setParam] = useState<SHCParamGet>({
    PageIndex: 1,
    PageSize: 10,
  } as unknown as SHCParamGet);
  const [hardware, setHardware] = useState<ServerHardwareConfigData>();

  const [itemBreadcrumbs, setItemBreadcrumbs] = useState<ItemType[]>([]);

  const getData = async () => {
    var customerId = "",
      userId = "";
    if (session?.user.roles.includes("Customer")) {
      customerId = parseJwt(session?.user.access_token!).UserId;
    } else if (session?.user.roles.includes("Tech")) {
      userId = parseJwt(session?.user.access_token!).UserId;
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
        ...param,
        ServerAllocationId: parseInt(router.query.serverAllocationId + ""),
      } as SHCParamGet)
      .then((res) => {
        setHardware(res);
      });
    dispatch(
      getIncidentData({
        token: session?.user.access_token!,
        paramGet: {
          ...paramGet,
          CustomerId: customerId,
          UserId: userId,
        },
      })
    ).then(({ payload }) => {
      var res = payload as IncidentData;
      if (res?.totalPage < paramGet.PageIndex && res.totalPage != 0) {
        setParamGet({ ...paramGet, PageIndex: res.totalPage });
      }
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
          {areInArray(
            session?.user.roles!,
            ROLE_SALES,
            ROLE_TECH,
            ROLE_CUSTOMER
          ) && (
            <>
              <div className="flex flex-wrap items-center justify-between mb-4 p-2 bg-[#f8f9fa]/10 border border-gray-200 rounded-lg shadow-lg shadow-[#e7edf5]/50">
                <BreadcrumbComponent itemBreadcrumbs={itemBreadcrumbs} />
              </div>
              <ServerDetail
                serverAllocationDetail={serverAllocationDetail!}
                hardware={hardware!}
              ></ServerDetail>
              <IncidentTable
                urlOncell={`/server/${serverAllocationDetail?.id}`}
                serverAllocationId={serverAllocationDetail?.id.toString()}
              />
              {incidentData?.totalPage > 0 && (
                <Pagination
                  className="text-end m-4"
                  current={paramGet?.PageIndex}
                  pageSize={incidentData?.pageSize ?? 10}
                  total={incidentData?.totalSize}
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

export default Incident;
