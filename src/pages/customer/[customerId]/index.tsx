"use client";
import { AppstoreAddOutlined, SendOutlined } from "@ant-design/icons";
import BreadcrumbComponent from "@components/BreadcrumbComponent";
import CustomerDetail from "@components/customer/CustomerDetail";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import { Customer } from "@models/customer";
import {
  ServerAllocationData,
  SAUpdateModel,
  ServerAllocation,
} from "@models/serverAllocation";
import customerService from "@services/customer";
import serverService from "@services/serverAllocation";
import { Alert, Button, FloatButton, Modal, Pagination, message } from "antd";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ModalUpdate from "@components/server/ModalUpdate";
import ServerAllocationTable from "@components/customer/ServerAllocationTable";
import { getServerAllocationData } from "@slices/customer";
import { areInArray } from "@utils/helpers";
import { ROLE_CUSTOMER, ROLE_SALES, ROLE_TECH } from "@utils/constants";
import ModalEmpty from "@components/ModalEmpty";
import { ParamGet, ParamGetWithId } from "@models/base";

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});
const Customer: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { serverAllocationData } = useSelector(
    (state) => state.serverAllocation
  );

  const [paramGet, setParamGet] = useState<ParamGet>({
    PageIndex: 1,
    PageSize: 10,
    CustomerId: router.query.customerId ?? -1,
  } as unknown as ParamGet);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [serverUpdate, setUpdate] = useState<ServerAllocation | undefined>(
    undefined
  );
  const [customerDetail, setCustomerDetail] = useState<Customer>();
  const [serverList, setServerList] = useState<ServerAllocationData>();
  const [totalServerListSize, setTotalServerListSize] = useState<number>(0);

  const [itemBreadcrumbs, setItemBreadcrumbs] = useState<ItemType[]>([]);
  const [content, setContent] = useState<string>("");

  const getData = async () => {
    await customerService
      .getCustomerById(
        session?.user.access_token!,
        router.query.customerId + ""
      )
      .then(async (res) => {
        setCustomerDetail(res);
      })
      .catch((errors) => {
        setCustomerDetail(undefined);
        setContent("Customer NOT EXISTED");
      });
    await serverService
      .getServerAllocationData(
        session?.user.access_token!,
        paramGet
      )
      .then((result) => {
        setServerList(result);
        setTotalServerListSize(result?.totalSize ?? 0);
        var res = result as ServerAllocationData;
        if (res.totalPage < paramGet.PageIndex && res.totalPage != 0) {
          setParamGet({ ...paramGet, PageIndex: res.totalPage });
        }
      })
      .catch((errors) => {
      });
  };

  const updateData = async (data: SAUpdateModel) => {
    await serverService
      .updateServerAllocation(session?.user.access_token!, data)
      .then((res) => {
        message.success("Update successfully!");
        getData();
      })
      .catch((errors) => {
        message.error(errors.response.data);
      })
      .finally(() => {
        setUpdate(undefined);
      });
  };

  const handleBreadCumb = () => {
    var itemBrs = [] as ItemType[];
    var items = router.asPath.split("/").filter((_) => _ != "");
    if (customerDetail?.companyName) {
      items.push(customerDetail?.companyName);
    }
    var path = "";
    items.forEach((element) => {
      if (element !== customerDetail?.id + "") {
        path += `/${element}`;
        itemBrs.push({
          href: path,
          title: element,
        });
      }
    });
    setItemBreadcrumbs(itemBrs);
  };

  useEffect(() => {
    if (router.query.customerId && session) {
      handleBreadCumb();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerDetail]);

  useEffect(() => {
    if (router.query.customerId && session) {
      paramGet.CustomerId = router.query.customerId!.toString();
      getData();
      handleBreadCumb();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, paramGet]);

  if (customerDetail === undefined) {
    return (<AntdLayoutNoSSR
      content={
        <>
          <ModalEmpty
            isPermission={false}
            content={content}
          />
        </>
      } />)
  } else
    return (
      <AntdLayoutNoSSR
        content={
          <>
            <div className="flex flex-wrap items-center justify-between mb-4 p-2 bg-[#f8f9fa]/10 border border-gray-200 rounded-lg shadow-lg shadow-[#e7edf5]/50">
              <BreadcrumbComponent itemBreadcrumbs={itemBreadcrumbs} />
              {/* <SearchComponent
              placeholder="Search Name, Description..."
              setSearchValue={(value) =>
                setParamGet({ ...paramGet, SearchValue: value })
              }
            /> */}
            </div>
            <ModalUpdate
              serverAllocation={serverUpdate!}
              onClose={() => setUpdate(undefined)}
              onSubmit={(data: SAUpdateModel) => {
                updateData(data);
              }}
            />
            {areInArray(
              session?.user.roles!,
              ROLE_SALES,
              ROLE_TECH,
              ROLE_CUSTOMER
            ) && (customerDetail !== undefined) && (
                <>
                  <CustomerDetail customerDetail={customerDetail!}></CustomerDetail>
                  <ServerAllocationTable
                    urlOncell={`/customer/${customerDetail?.id}`}
                    data={serverList}
                    onEdit={(record) => {
                      setUpdate(record);
                    }}
                  />
                  {totalServerListSize > 0 && (
                    <Pagination
                      className="text-end m-4"
                      current={paramGet.PageIndex}
                      pageSize={totalServerListSize ?? 10}
                      total={totalServerListSize}
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
