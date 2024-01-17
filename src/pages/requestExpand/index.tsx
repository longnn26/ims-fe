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
import { Alert, Modal, Pagination, Tabs, TabsProps, message } from "antd";
import { useSession } from "next-auth/react";
import requestExpandService from "@services/requestExpand";
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
import { getRequestExpandData } from "@slices/requestExpand";
import { RequestExpand, RequestExpandData } from "@models/requestExpand";
import RequestExpandTable from "@components/server/requestExpand/RequestExpandTable";
const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});
const { confirm } = Modal;

const Customer: React.FC = () => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const { requestExpandData } = useSelector((state) => state.requestExpand);
  const [status, setStatus] = useState<string | undefined>(undefined);

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
      getRequestExpandData({
        token: session?.user.access_token!,
        paramGet: {
          ...paramGet,
          CustomerId: customerId,
          UserId: userId,
          Statuses: status,
        },
      })
    ).then(({ payload }) => {
      var res = payload as RequestExpandData;
      if (res?.totalPage < paramGet.PageIndex && res.totalPage != 0) {
        setParamGet({ ...paramGet, PageIndex: res.totalPage });
      }
    });
  };

  const handleChange = (value) => {
    switch (value) {
      case "0":
        setStatus(undefined);
        break;
      case "1":
        setStatus("Waiting");
        break;
      case "2":
        setStatus("Accepted");
        break;
      case "3":
        setStatus("Denied");
        break;
      case "4":
        setStatus("Success");
        break;
      case "5":
        setStatus("Failed");
        break;
    }
  };

  const items: TabsProps["items"] = [
    {
      key: "0",
      label: "All",
    },
    {
      key: "1",
      label: "Waiting",
    },
    {
      key: "2",
      label: "Accepted",
    },
    {
      key: "3",
      label: "Denied",
    },
    {
      key: "4",
      label: "Success",
    },
    {
      key: "5",
      label: "Failed",
    },
  ];

  useEffect(() => {
    session && getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    session && getData();
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
              <Tabs
                className="m-5"
                defaultActiveKey="0"
                items={items}
                centered
                onTabClick={(value) => handleChange(value)}
              />

              <RequestExpandTable
                urlOncell=""
                onEdit={() => {}}
                onDelete={() => {}}
              />

              {requestExpandData.totalPage > 0 && (
                <Pagination
                  className="text-end m-4"
                  current={paramGet?.PageIndex}
                  pageSize={requestExpandData?.pageSize ?? 10}
                  total={requestExpandData?.totalSize}
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
