"use client";
import React, { useEffect, useState } from "react";
import { Button } from "antd";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { User } from "@models/user";
import userService from "@services/user";
import AccountDetail from "@components/myAccount/AccountDetail";
import ModalChangePassword from "@components/myAccount/ModalChangePassword";

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});

const MyAccountPage: React.FC = () => {
  const { data: session } = useSession();
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
  useState<boolean>(false);
  const [userDetail, setUserDetail] = useState<User | undefined>(undefined);

  const getData = async () => {
    userService.getUserProfile(session?.user.access_token!).then((res) => {
      setUserDetail(res);
    });
  };

  useEffect(() => {
    session && getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

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
          <ModalChangePassword
            open={openModalUpdate}
            onClose={() => setOpenModalUpdate(false)}
            dataUser={userDetail}
            onSubmit={() => {
              getData();
              setOpenModalUpdate(false);
            }}
          />
          <div className="flex justify-between mb-4 p-2 bg-[#f8f9fa]/10 border border-gray-200 rounded-lg shadow-lg shadow-[#e7edf5]/50">
            <AccountDetail userDetail={userDetail} />
          </div>
        </>
      }
    />
  );
};

export default MyAccountPage;
