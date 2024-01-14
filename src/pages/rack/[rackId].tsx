"use client";
import { CaretLeftOutlined } from "@ant-design/icons";
import RackDetail from "@components/area/rack/RackDetail";
import RackMapRender from "@components/area/rack/RackMapRender";
import PieChartComponent from "@components/chartComponent/Pie";
import { Rack, RackMap } from "@models/rack";
import area from "@services/rack";
import { ROLE_MANAGER, ROLE_TECH } from "@utils/constants";
import { areInArray } from "@utils/helpers";
import { Avatar, Button, List } from "antd";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});

const AreaDetail: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [rackDetail, setRackDetail] = useState<Rack | undefined>(undefined);
  const [rackMapList, setRackMapList] = useState<RackMap[]>([]);
  var available =
    rackMapList.filter((_) => !_.serverAllocation).length / rackMapList.length;
  var reserved =
    rackMapList.filter((_) => _.serverAllocation).length / rackMapList.length;
  var booked =
    rackMapList.filter((_) => _.requestedServerAllocation).length /
    rackMapList.length;

  const getData = async () => {
    await area
      .getRackById(session?.user.access_token!, router.query.rackId + "")
      .then((res) => {
        setRackDetail(res);
      });
    await area
      .getMapsById(session?.user.access_token!, router.query.rackId + "")
      .then((e) => setRackMapList([...e]));
  };

  useEffect(() => {
    if (router.query.rackId && session) {
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, router.query.rackId]);

  return (
    <AntdLayoutNoSSR
      content={
        <>
          {areInArray(session?.user.roles!, ROLE_TECH, ROLE_MANAGER) && (
            <>
              <div className="flex justify-between mb-4 p-2 bg-[#f8f9fa]/10 border border-gray-200 rounded-lg shadow-lg shadow-[#e7edf5]/50">
                {/* <BreadcrumbComponent itemBreadcrumbs={itemBreadcrumbs} /> */}
                <Button
                  type="primary"
                  className="mb-2"
                  icon={<CaretLeftOutlined />}
                  onClick={() => router.back()}
                ></Button>
              </div>

              <RackDetail rackDetail={rackDetail!} />
              <div className="flex ">
                <div className="w-2/3">
                  <RackMapRender rackMapList={rackMapList} />
                </div>
                <div className="w-1/3">
                  <PieChartComponent
                    data={[
                      { name: "Available", value: available, color: "#e1efd8" },
                      { name: "Booked", value: booked, color: "#c2e4ea" },
                      { name: "Reserved", value: reserved, color: "#fbe4d4" },
                    ]}
                  />
                </div>
              </div>
            </>
          )}
        </>
      }
    />
  );
};

export default AreaDetail;
