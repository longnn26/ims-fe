"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import React from "react";
import { ParamGet } from "@models/base";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import { getCustomerData } from "@slices/customer";
import {
  CustomerCreateModel,
  CustomerUpdateModel,
  Customer,
  CustomerData,
  CusParam,
} from "@models/customer";
import { Button, Pagination, message, Modal, Alert, Spin } from "antd";
import ModalCreate from "@components/customer/ModalCreate";
import customerService from "@services/customer";
import ModalUpdate from "@components/customer/ModalUpdate";
import CustomerTable from "@components/customer/CustomerTable";
import { areInArray } from "@utils/helpers";
import { ROLE_SALES, ROLE_TECH } from "@utils/constants";
import SearchComponent from "@components/SearchComponent";
const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});

const { confirm } = Modal;

const Customer: React.FC = () => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const { customerData } = useSelector((state) => state.customer);

  const [paramGet, setParamGet] = useState<CusParam>({
    PageIndex: 1,
    PageSize: 10,
  } as CusParam);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [customerUpdate, setCustomerUpdate] = useState<Customer | undefined>(
    undefined
  );
  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);

  const getData = async () => {
    dispatch(
      getCustomerData({
        token: session?.user.access_token!,
        paramGet: { ...paramGet, SortKey: "DateCreated", SortOrder: "DESC" },
      })
    ).then(({ payload }) => {
      var res = payload as CustomerData;
      //muốn k lỗi res.totalPage
      if (res) {
        if (res.totalPage < paramGet.PageIndex && res.totalPage != 0) {
          setParamGet({ ...paramGet, PageIndex: res.totalPage });
        }
      }
    });
  };

  const deleteComponent = (customer: Customer) => {
    confirm({
      title: "Delete",
      content: (
        <Alert
          message={`Do you want to delete Customer ${customer.companyName}?`}
          // description={`${serverAllocation.id}`}
          type="warning"
        />
      ),
      async onOk() {
        setLoadingSubmit(true);
        await customerService
          .deleteData(session?.user.access_token!, customer.id)
          .then(() => {
            getData();
            message.success(`Delete customer successfully!`, 1.5);
          })
          .catch((errors) => {
            message.error(errors.response.data ?? "Delete customer failed", 1.5);
            setLoadingSubmit(false);
          });
      },
      onCancel() {},
    });
  };

  useEffect(() => {
    session && getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, paramGet, openModalCreate]); //Loading: thêm openModalCreate
  return (
    <AntdLayoutNoSSR
      content={
        <>
          <div className="flex justify-between mb-4 p-2 bg-[#f8f9fa]/10 border border-gray-200 rounded-lg shadow-lg shadow-[#e7edf5]/50">
            {areInArray(session?.user.roles!, ROLE_SALES) && (
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => {
                  setOpenModalCreate(true);
                }}
              >
                Create
              </Button>
            )}
            {!areInArray(session?.user.roles!, ROLE_SALES) && (
              <div className="flex-grow"></div>
            )}
            <SearchComponent
              placeholder="Search Name, Description..."
              setSearchValue={(value) =>
                setParamGet({ ...paramGet, CompanyName: value })
              }
            />
          </div>
          {areInArray(session?.user.roles!, ROLE_SALES, ROLE_TECH) && (
            <>
              <CustomerTable
                onEdit={(record) => {
                  setCustomerUpdate(record);
                }}
                onDelete={async (record) => {
                  deleteComponent(record);
                }}
              />
              {customerData.totalPage > 0 && (
                <Pagination
                  className="text-end m-4"
                  current={paramGet.PageIndex}
                  pageSize={customerData.pageSize ?? 10}
                  total={customerData.totalSize}
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
          <ModalCreate
            open={openModalCreate}
            onClose={() => setOpenModalCreate(false)}
            onSubmit={() => {
              //Loading: thêm chỗ này
              setOpenModalCreate(false);
              getData();
            }}
          />
          <ModalUpdate
            customer={customerUpdate!}
            onClose={() => setCustomerUpdate(undefined)}
            onSubmit={() => {
              setCustomerUpdate(undefined);
              getData();
            }}
          />
        </>
      }
    />
  );
};

export default Customer;
