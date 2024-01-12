"use client";
import BreadcrumbComponent from "@components/BreadcrumbComponent";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import { ServerAllocationData } from "@models/serverAllocation";
import ipSubnetService from "@services/ipSubnet";
import { Pagination } from "antd";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { getServerAllocationData } from "@slices/serverAllocation";
import { areInArray } from "@utils/helpers";
import { ROLE_TECH } from "@utils/constants";
import { ParamGet } from "@models/base";
import HistoryIpAddressTable from "@components/ipSubnet/HistoryIpAddressTable";
import ipAddress from "@services/ipAddress";
import { IpAddress, IpAddressHistory } from "@models/ipAddress";
import { getIpAddressData, getIpAddressHistoryData } from "@slices/ipSubnet";
import { IpSubnet } from "@models/ipSubnet";

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});
const Customer: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: session } = useSession();
  const { ipAddressHistoryData } = useSelector((state) => state.ipSubnet);

  const [paramGet, setParamGet] = useState<ParamGet>({
    PageIndex: 1,
    PageSize: 10,
  } as ParamGet);

  const [historyDetail, setHistoryDetail] = useState<IpAddress>();
  const [itemBreadcrumbs, setItemBreadcrumbs] = useState<ItemType[]>([]);
  const [ipSubnetDetail, setIpSubnetDetail] = useState<IpSubnet>();

  const getData = async () => {
    await ipSubnetService
      .getDetail(session?.user.access_token!, router.query.ipSubnet+"")
      .then((res) => {
        setIpSubnetDetail(res);
      });
    await ipAddress
      .getDetail(session?.user.access_token!, router.query.ipAddressId + "")
      .then((res) => {
        setHistoryDetail(res);
      })
      .catch((errors) => {
        setHistoryDetail(undefined);
      });
    dispatch(
      getIpAddressHistoryData({
        token: session?.user.access_token!,
        id: router.query.ipAddressId + "",
      })
    ).then(({ payload }) => {
      var res = payload as ServerAllocationData;
      if (res?.totalPage < paramGet.PageIndex && res.totalPage != 0) {
        setParamGet({
          ...paramGet,
          PageIndex: res.totalPage,
          CustomerId: router.query.customerId + "",
        });
      }
    });
  };

  const handleBreadCumb = () => {
    var itemBrs = [] as ItemType[];
    var items = router.asPath.split("/").filter((_) => _ != "");
    var path = "";
    items.forEach((element) => {
      if ((element !== ipSubnetDetail?.id + "") && (element !== router.query.ipAddressId +"")) {
        path += `/${element}`;
        itemBrs.push({
          href: path,
          title: element,
        });
      } else if (element === router.query.ipAddressId +"") {
        itemBrs.push({
          title: `${historyDetail?.address}`,
        });
      } else {
        itemBrs.push({
          title: `${ipSubnetDetail?.firstOctet}.${ipSubnetDetail?.secondOctet}.${ipSubnetDetail?.thirdOctet}.${ipSubnetDetail?.fourthOctet}/${ipSubnetDetail?.prefixLength}`,
        });
      }
    });
    setItemBreadcrumbs(itemBrs);
  };

  useEffect(() => {
    if (router.query.ipAddressId && session) {
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
          </div>

          {areInArray(session?.user.roles!, ROLE_TECH) && (
            <>
              <HistoryIpAddressTable
                onEdit={() => { }}
                onBlock={() => { }}
                onDelete={() => { }}
              />
              {ipAddressHistoryData?.totalPage > 0 && (
                <Pagination
                  className="text-end m-4"
                  current={paramGet.PageIndex}
                  pageSize={ipAddressHistoryData?.pageSize ?? 10}
                  total={ipAddressHistoryData?.totalSize}
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
