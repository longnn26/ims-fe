"use client";
import BreadcrumbComponent from "@components/BreadcrumbComponent";
import IpSubnetDetailInfor from "@components/ipSubnet/IpSubnetDetail";
import { RequestExpand, SuggestLocation } from "@models/requestExpand";
import { RUAppointmentParamGet } from "@models/requestUpgrade";
import { ServerAllocation } from "@models/serverAllocation";
import ipSubnetService from "@services/ipSubnet";
import serverAllocationService from "@services/serverAllocation";
import { Button, Pagination } from "antd";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useSelector from "@hooks/use-selector";
import useDispatch from "@hooks/use-dispatch";
import { CaretLeftOutlined } from "@ant-design/icons";
import { IpSubnet } from "@models/ipSubnet";
import { ParamGetWithId } from "@models/base";
import { getIpAddressData } from "@slices/ipSubnet";
import IpAddressTable from "@components/ipSubnet/IpAddressTable";
const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});
const IpSubnetDetail: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const [ipSubnetDetail, setIpSubnetDetail] = useState<IpSubnet>();

  const [itemBreadcrumbs, setItemBreadcrumbs] = useState<ItemType[]>([]);
  const [ipAddressParamGet, setIpAddressParamGet] = useState<ParamGetWithId>({
    PageIndex: 1,
    PageSize: 10,
  } as unknown as ParamGetWithId);

  const { ipAddressData } = useSelector((state) => state.ipSubnet);

  const getData = async () => {
    await ipSubnetService
      .getDetail(session?.user.access_token!, router.query.ipSubnetId + "")
      .then(async (res) => {
        setIpSubnetDetail(res);
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
    if (router.query.ipSubnetId && session) {
      getData();
      handleBreadCumb();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  useEffect(() => {
    if (router.query.ipSubnetId && session) {
      ipAddressParamGet.Id = parseInt(router.query.ipSubnetId!.toString());
      dispatch(
        getIpAddressData({
          token: session?.user.access_token!,
          paramGet: { ...ipAddressParamGet },
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, ipAddressParamGet]);

  return (
    <AntdLayoutNoSSR
      content={
        <>
          <div className="flex flex-wrap items-center justify-between mb-4 p-2 bg-[#f8f9fa]/10 border border-gray-200 rounded-lg shadow-lg shadow-[#e7edf5]/50">
            <div>
              <Button
                type="primary"
                className="mb-2"
                icon={<CaretLeftOutlined />}
                onClick={() => router.back()}
              ></Button>
              <BreadcrumbComponent itemBreadcrumbs={itemBreadcrumbs} />
            </div>
          </div>
          <IpSubnetDetailInfor
            ipSubnetDetail={ipSubnetDetail!}
          ></IpSubnetDetailInfor>
          <IpAddressTable
            onEdit={(record) => {}}
            onDelete={async (record) => {}}
          />
          {ipAddressData?.totalPage > 0 && (
            <Pagination
              className="text-end m-4"
              current={ipAddressParamGet?.PageIndex}
              pageSize={ipAddressData?.pageSize ?? 10}
              total={ipAddressData?.totalSize}
              onChange={(page, pageSize) => {
                console.log(page);
                setIpAddressParamGet({
                  ...ipAddressParamGet,
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

export default IpSubnetDetail;
