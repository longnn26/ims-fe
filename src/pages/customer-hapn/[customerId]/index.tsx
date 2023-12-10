"use client";
import { AppstoreAddOutlined, SendOutlined } from "@ant-design/icons";
import BreadcrumbComponent from "@components/BreadcrumbComponent";
import CustomerDetail from "@components/customer/CustomerDetail";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import { Customer } from "@models/customer";
import {
    SAParamGet,
    ServerAllocationData,
    SAUpdateModel,
    ServerAllocation,
} from "@models/serverAllocation-hapn";
import customerService from "@services/customer";
import serverService from "@services/serverAllocationHapn";
import { Alert, Button, FloatButton, Modal, Pagination, message } from "antd";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ModalUpdate from "@components/server/ModalUpdate";
import ServerAllocationTable from "@components/customer/ServerAllocationTable";
import { getServerAllocationData } from "@slices/customer";

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
    ssr: false,
});
const Customer: React.FC = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const { serverAllocationData } = useSelector(
        (state) => state.serverAllocation
    );

    const [paramGet, setParamGet] = useState<SAParamGet>({
        PageIndex: 1,
        PageSize: 10,
        CustomerId: router.query.customerId ?? -1,
    } as unknown as SAParamGet);
    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
    const [serverUpdate, setUpdate] = useState<
        ServerAllocation | undefined
    >(undefined);
    const [customerDetail, setCustomerDetail] =
        useState<Customer>();
    const [serverList, setServerList] = useState<ServerAllocationData>();
    const [totalServerListSize, setTotalServerListSize] = useState<number>(0);

    const [itemBreadcrumbs, setItemBreadcrumbs] = useState<ItemType[]>([]);

    const getData = async () => {
        await customerService
            .getCustomerById(
                session?.user.access_token!,
                router.query.customerId + ""
            )
            .then((res) => {
                setCustomerDetail(res);
            });
        await customerService.getServerById(
            session?.user.access_token!,
            router.query.customerId + ""
        )
        .then((result) => {
            setServerList(result);
            setTotalServerListSize(result?.totalSize ?? 0);
            var res = result as ServerAllocationData;
            if (res.totalPage < paramGet.PageIndex && res.totalPage != 0) {
                setParamGet({ ...paramGet, PageIndex: res.totalPage });
            }
        });
    };

    const updateData = async (data: SAUpdateModel) => {
        await serverService
            .updateServerAllocation(session?.user.access_token!, data)
            .then((res) => {
                message.success("Update successful!");
                getData();
            })
            .catch((errors) => {
                message.error(errors.message);
            })
            .finally(() => {
                setUpdate(undefined);
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
        if (router.query.customerId && session) {
            paramGet.CustomerId = parseInt(
                router.query.customerId!.toString()
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
                    <CustomerDetail
                        customerDetail={customerDetail!}
                    ></CustomerDetail>
                    <ServerAllocationTable
                        data={serverList}
                        onEdit={(record) => {
                            setUpdate(record);
                        }}/>
                    {totalServerListSize > 0 && (
                        <Pagination
                            className="text-end m-4"
                            current={paramGet.PageIndex}
                            pageSize={totalServerListSize ?? 10}
                            total={totalServerListSize }
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
