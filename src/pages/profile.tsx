"use client";
import React, { useEffect, useState } from "react";
import { Button } from "antd";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { ParamGet } from "@models/base";
import { User } from "@models/user";
import { Customer } from "@models/customer";
import customerService from "@services/customer";
import AccountDetail from "@components/myAccount/AccountDetail";
import ModalUpdate from "@components/myAccount/ModalUpdate";

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});

const MyAccountPage: React.FC = () => {
  const { data: session } = useSession();
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);

  const [isCustomer, setIsCustomer] = useState<boolean>(false);
  const [staffAccountDetail, setStaffAccountDetail] = useState<
    User | undefined
  >(undefined);
  const [customerDetail, setCustomerDetail] = useState<Customer | undefined>(
    undefined
  );

  const [paramGet, setParamGet] = useState<ParamGet>({
    pageIndex: 1,
    pageSize: 10,
  } as ParamGet);

  const getData = async () => {
    customerService
      .getCustomerProfile(session?.user.access_token!)
      .then((res) => {
        setIsCustomer(true);
        setCustomerDetail(res);
        setStaffAccountDetail(undefined);
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
          <div className="flex justify-end mb-4 p-2 bg-[#f8f9fa]/10 border border-gray-200 rounded-lg shadow-lg shadow-[#e7edf5]/50">
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => {
                setOpenModalUpdate(true);
              }}
            >
              Change Password
            </Button>
          </div>
          <ModalUpdate
            isCustomer={isCustomer}
            open={openModalUpdate}
            onClose={() => setOpenModalUpdate(false)}
            dataStaff={staffAccountDetail}
            dataCust={customerDetail}
            onSubmit={() => {
              getData();
              setOpenModalUpdate(false);
            }}
          />
          <div className="flex justify-between mb-4  bg-[#f8f9fa]/10 border border-gray-200 rounded-lg shadow-lg shadow-[#e7edf5]/50">
            <AccountDetail
              isCustomer={isCustomer}
              staffAccountDetail={staffAccountDetail}
              customerAccountDetail={customerDetail}
            />
            {/* {isCustomer === true && (
                            <ContactsTable
                                customerContact={customerDetail?.contacts!}
                            />
                        )} mai gỡ ròi sửa */}
          </div>
        </>
      }
    />
  );
};

export default MyAccountPage;
