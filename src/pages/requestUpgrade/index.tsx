"use client";
import RequestUpgradeTable from "@components/server/requestUpgrade/RequestUpgradeTable";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import {
  RUParamGet,
  RequestUpgrade,
  RequestUpgradeData,
  RequestUpgradeUpdateModel,
} from "@models/requestUpgrade";
import { getRequestUpgradeData } from "@slices/requestUpgrade";
import { Pagination, message } from "antd";
import { useSession } from "next-auth/react";
import requestUpgradeService from "@services/requestUpgrade";
import ModalUpdate from "@components/server/requestUpgrade/ModalUpdate";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});

const Customer: React.FC = () => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const { requestUpgradeData } = useSelector((state) => state.requestUpgrade);
  const [requestUpgradeUpdate, setRequestUpgradeUpdate] = useState<
    RequestUpgrade | undefined
  >(undefined);
  const [paramGet, setParamGet] = useState<RUParamGet>({
    PageIndex: 1,
    PageSize: 10,
  } as unknown as RUParamGet);

  const getData = async () => {
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

  useEffect(() => {
    session && getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, paramGet]);
  return (
    <AntdLayoutNoSSR
      content={
        <>
          <div className="flex justify-between mb-4 p-2 bg-[#f8f9fa]/10 border border-gray-200 rounded-lg shadow-lg shadow-[#e7edf5]/50"></div>

          <ModalUpdate
            requestUpgrade={requestUpgradeUpdate!}
            onClose={() => setRequestUpgradeUpdate(undefined)}
            onSubmit={(data: RequestUpgradeUpdateModel) => {
              updateData(data);
            }}
          />

          <RequestUpgradeTable
            urlOncell=""
            onEdit={(record) => {setRequestUpgradeUpdate(record)}}
            onDelete={async (record) => {}}
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

export default Customer;
