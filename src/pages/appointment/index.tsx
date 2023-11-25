"use client";
import AppointmentTable from "@components/server/requestUpgrade/AppointmentTable";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import { RUAppointmentParamGet } from "@models/requestUpgrade";
import { getListAppointment } from "@slices/appointment";
import { Pagination } from "antd";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});
const Appoinment: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: session } = useSession();
  const { listAppointmentData } = useSelector((state) => state.appointment);

  const [itemBreadcrumbs, setItemBreadcrumbs] = useState<ItemType[]>([]);
  const [rUAppointmentParamGet, setRUAppointmentParamGet] =
    useState<RUAppointmentParamGet>({
      PageIndex: 1,
      PageSize: 10,
    } as unknown as RUAppointmentParamGet);

  const getData = async () => {
    await dispatch(
      getListAppointment({
        token: session?.user.access_token!,
        paramGet: { ...rUAppointmentParamGet },
      })
    );
  };

  useEffect(() => {
    if (session) {
      getData();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, rUAppointmentParamGet]);

  return (
    <AntdLayoutNoSSR
      content={
        <>
          <AppointmentTable
            typeGet="All"
            urlOncell=""
            onEdit={(record) => {}}
            onDelete={async (record) => {}}
          />
          {listAppointmentData?.totalPage > 0 && (
            <Pagination
              className="text-end m-4"
              current={rUAppointmentParamGet?.PageIndex}
              pageSize={listAppointmentData?.pageSize ?? 10}
              total={listAppointmentData?.totalSize}
              onChange={(page, pageSize) => {
                setRUAppointmentParamGet({
                  ...rUAppointmentParamGet,
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

export default Appoinment;
