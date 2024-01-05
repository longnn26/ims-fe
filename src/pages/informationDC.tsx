"use client";
import React, { useEffect, useState } from "react";
import { Button, Empty, message } from "antd";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import useDispatch from "@hooks/use-dispatch";
import informationDCService from "@services/informationDC";
import { areInArray } from "@utils/helpers";
import { ROLE_ADMIN } from "@utils/constants";
import InformationDCDetail from "@components/admin/InformationDCDetail";
import { InformationDC } from "@models/informationDC";
import ModalUpdateInformationDC from "@components/admin/ModalUpdateInformationDC";

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});

const InformationDCPage: React.FC = () => {
  const { data: session } = useSession();
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

  const updateData = async (data: InformationDC) => {
    await informationDCService
      .updateData(session?.user.access_token!, data)
      .then((res) => {
        message.success("Update successfully!", 1.5);
        getData();
        window.location.reload();
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
  }, [session]);
  useEffect(() => {
    if (informationDCDetail) {
      // logic here
    }
  }, [informationDCDetail]);
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

              <ModalUpdateInformationDC
                key={Math.random()} // Thêm key ngẫu nhiên để kích thích render lại
                open={openModalUpdate}
                onClose={() => setOpenModalUpdate(false)}
                data={informationDCDetail}
                onSubmit={(data: InformationDC) => {
                  updateData(data);
                }}
              />
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

export default InformationDCPage;
