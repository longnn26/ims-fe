"use client";
import BreadcrumbComponent from "@components/BreadcrumbComponent";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import { Appointment } from "@models/appointment";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import appointmentService from "@services/appointment";
import { CaretLeftOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import AppointmentDetail from "@components/appointment/AppointmentDetail";
import { Button } from "antd";
const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});
const Appoinment: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: session } = useSession();
  const { listAppointmentData } = useSelector((state) => state.appointment);

  const [itemBreadcrumbs, setItemBreadcrumbs] = useState<ItemType[]>([]);
  const [appointmentDetail, setAppointmentDetail] = useState<Appointment>();
  const getData = async () => {
    await appointmentService
      .getDetail(session?.user.access_token!, router.query.appointmentId + "")
      .then((res) => {
        setAppointmentDetail(res);
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
    if (router.query.appointmentId && session) {
      getData();
      handleBreadCumb();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return (
    <AntdLayoutNoSSR
      content={
        <>
          <div className="flex flex-wrap items-center justify-between mb-4 p-2 bg-[#f8f9fa]/10 border border-gray-200 rounded-lg shadow-lg shadow-[#e7edf5]/50">
            <div>
              <Button type="primary" className="mb-2" icon={<CaretLeftOutlined />} onClick={() => router.back()}></Button>
              <BreadcrumbComponent itemBreadcrumbs={itemBreadcrumbs} />
            </div>
            <AppointmentDetail appointmentDetail={appointmentDetail!} />
          </div>
        </>
      }
    />
  );
};

export default Appoinment;
