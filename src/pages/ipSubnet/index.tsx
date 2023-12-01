"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import React from "react";
import { ParamGet } from "@models/base";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import { getIpSubnetData } from "@slices/ipSubnet";
import { IpSubnetCreateModel, IpSubnet as IpSubnetObj, IpSubnetData } from "@models/ipSubnet";
import { Button, Pagination, message, Modal, Alert } from "antd";
import AreaTable from "@components/ipSubnet/IpSubnetTable";
import IpSubnetTable from "@components/ipSubnet/IpSubnetTable";
const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});

const { confirm } = Modal;

const IpSubnet: React.FC = () => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const { ipSubnetData, ipSubnetDataLoading } = useSelector(
    (state) => state.ipSubnet
  );

  const [paramGet, setParamGet] = useState<ParamGet>({
    PageIndex: 1,
    PageSize: 7,
  } as ParamGet);

  const getData = async () => {
    dispatch(
      getIpSubnetData({
        token: session?.user.access_token!,
        paramGet: { ...paramGet },
      })
    ).then(({ payload }) => {
      var res = payload as IpSubnetData;
      if (res.totalPage < paramGet.PageIndex && res.totalPage != 0) {
        setParamGet({ ...paramGet, PageIndex: res.totalPage });
      }
    });
  };

  useEffect(() => {
    session && getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, paramGet]);
  return (
    <AntdLayoutNoSSR
      content={
        <>
          <div className="flex justify-between mb-4 p-2 bg-[#f8f9fa]/10 border border-gray-200 rounded-lg shadow-lg shadow-[#e7edf5]/50"></div>
          <IpSubnetTable
            onEdit={(record) => {}}
            onDelete={async (record) => {}}
          />

          {ipSubnetData.totalPage > 0 && (
            <Pagination
              className="text-end m-4"
              current={paramGet.PageIndex}
              pageSize={ipSubnetData.pageSize ?? 10}
              total={ipSubnetData.totalSize}
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

export default IpSubnet;
