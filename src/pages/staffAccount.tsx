"use client";
import React, { useEffect, useState } from "react";
import { Button, Empty } from "antd";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import useDispatch from "@hooks/use-dispatch";
import { ParamGet } from "@models/base";
//import ModalCreate from "@components/admin/ModalCreate";
import { 
  UserData,
  User
} from "@models/user";
import {
  getUserData
} from "@slices/user"
import userService from "@services/user";
import useSelector from "@hooks/use-selector";
import StaffAccountTable from "@components/admin/StaffAccountTable";
import StaffAccountDetail from "@components/admin/StaffAccountDetail";

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});

const StaffAccountPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const { userData } = useSelector((state) => state.user);
  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
  const [staffAccountDetail, setStaffAccountDetail] = useState<User | undefined>(undefined);

  const [paramGet, setParamGet] = useState<ParamGet>({
    PageIndex: 1,
    PageSize: 7,
  } as ParamGet);

  const getData = async () => {
    dispatch(
      getUserData({
        token: session?.user.access_token!,
        paramGet: { ...paramGet },
      })
    ).then(({ payload }) => {
      var res = payload as UserData;
      if (res?.totalPage < paramGet.PageIndex && res.totalPage != 0) {
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
          <div className="flex justify-between mb-4 p-2 bg-[#f8f9fa]/10 border border-gray-200 rounded-lg shadow-lg shadow-[#e7edf5]/50">
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => {
                setOpenModalCreate(true);
              }}
            >
              Create
            </Button>
          </div>
          <div className="flex justify-between">
            {/* Left side: StaffAccountTable */}
            <div style={{ width: 'calc(100% - 70%)' }}>
              <StaffAccountTable 
                onRowClick={(record) => {
                  const selectedUser = userData?.data.find(user => user.id === record.id);
                  if (selectedUser) {
                    setStaffAccountDetail(selectedUser);
                }}}
              />
            </div>

            {/* Right side */}
            <div>
              <StaffAccountDetail
                staffAccountDetail={staffAccountDetail}
              />
            </div>
          </div>
        </>
      }
    />
  );
};

export default StaffAccountPage;
