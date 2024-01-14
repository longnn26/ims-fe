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
import { Alert, Modal, Pagination, message } from "antd";
import { useSession } from "next-auth/react";
import requestUpgradeService from "@services/requestUpgrade";
import ModalUpdate from "@components/server/requestUpgrade/ModalUpdate";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import {
  ROLE_CUSTOMER,
  ROLE_MANAGER,
  ROLE_SALES,
  ROLE_TECH,
} from "@utils/constants";
import { areInArray, parseJwt } from "@utils/helpers";
import SearchComponent from "@components/SearchComponent";
const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});
const { confirm } = Modal;

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
    var customerId = "",
      userId = "";
    if (areInArray(session?.user.roles!, ROLE_SALES)) {
      userId = parseJwt(session?.user.access_token!).UserId;
    } else if (session?.user.roles.includes("Customer")) {
      customerId = parseJwt(session.user.access_token).UserId;
    }
    dispatch(
      getRequestUpgradeData({
        token: session?.user.access_token!,
        paramGet: { ...paramGet, CustomerId: customerId, UserId: userId },
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
        message.success("Update successfully!", 1.5);
        getData();
      })
      .catch((errors) => {
        message.error(errors.response.data, 1.5);
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
        await requestUpgradeService
          .deleteData(session?.user.access_token!, requestUpgrade.id.toString())
          .then(() => {
            getData();
            message.success(`Delete request upgrade successfully`, 1.5);
          })
          .catch((errors) => {
            message.error(
              errors.response.data ?? "Delete request upgrade failed",
              1.5
            );
          });
      },
      onCancel() {},
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
          {areInArray(
            session?.user.roles!,
            ROLE_TECH,
            ROLE_SALES,
            ROLE_CUSTOMER,
            ROLE_MANAGER
          ) && (
            <>
              <div className="flex justify-end mb-4 p-2 bg-[#f8f9fa]/10 border border-gray-200 rounded-lg shadow-lg shadow-[#e7edf5]/50">
                <SearchComponent
                  placeholder="Search Name, Description..."
                  setSearchValue={(value) =>
                    setParamGet({ ...paramGet, SearchValue: value })
                  }
                />
              </div>

              <RequestUpgradeTable
                urlOncell=""
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
          )}
        </>
      }
    />
  );
};

export default Customer;
