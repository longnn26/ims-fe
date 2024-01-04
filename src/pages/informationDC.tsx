"use client";
import React, { useEffect, useState } from "react";
import { Button, Empty, message, Pagination } from "antd";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import useDispatch from "@hooks/use-dispatch";
import { ParamGet } from "@models/base";
import informationDCService from "@services/informationDC";
import { UserData, User, UserUpdateModel } from "@models/user";
import userService from "@services/user";
import useSelector from "@hooks/use-selector";

import ModalUpdate from "@components/admin/ModalUpdate";
import { areInArray } from "@utils/helpers";
import { ROLE_ADMIN } from "@utils/constants";
import InformationDCDetail from "@components/admin/InformationDCDetail";
import { InformationDC } from "@models/informationDC";

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});

const StaffAccountPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const { userData } = useSelector((state) => state.user);
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);

  const [informationDCDetail, setInformationDCDetail] = useState<
    InformationDC | undefined
  >();

  const getData = async () => {
    await informationDCService
      .getData(session?.user.access_token!)
      .then((res) => {
        setInformationDCDetail(res);
      });
  };

  const updateData = async (data: UserUpdateModel) => {
    await userService
      .update(session?.user.access_token!, data)
      .then((res) => {
        message.success("Update successfully!", 1.5);
        getData();
      })
      .catch((errors) => {
        message.error(errors.response.data, 1.5);
      })
      .finally(() => {
        setOpenModalUpdate(false);
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
          {areInArray(session?.user.roles!, ROLE_ADMIN) && (
            <>
              <div className="flex justify-between mb-4 p-2 bg-[#f8f9fa]/10 border border-gray-200 rounded-lg shadow-lg shadow-[#e7edf5]/50">
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={() => {
                    setOpenModalUpdate(true);
                  }}
                >
                  Update Information DC
                </Button>
              </div>

              {/* <ModalUpdate
                open={openModalUpdate}
                onClose={() => setOpenModalUpdate(false)}
                data={informationDCDetail}
                onSubmit={(data: UserUpdateModel) => {
                  updateData(data);
                }}
              /> */}
              <div>
                <InformationDCDetail
                  informationDCDetail={informationDCDetail}
                />
              </div>
            </>
          )}
        </>
      }
    />
  );
};

export default StaffAccountPage;
