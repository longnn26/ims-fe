"use client";
import { CaretLeftOutlined } from "@ant-design/icons";
import RackDetail from "@components/area/rack/RackDetail";
import useDispatch from "@hooks/use-dispatch";
import { Rack } from "@models/rack";
import area from "@services/rack";
import { Button, DescriptionsProps, Modal } from "antd";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});
var itemBreadcrumbs: ItemType[] = [];
const { confirm } = Modal;

const AreaDetail: React.FC = () => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const router = useRouter();
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [rackDetail, setRackDetail] = useState<Rack | undefined>(undefined);

  const getData = async () => {
    await area
      .getRackById(session?.user.access_token!, router.query.rackId + "")
      .then((res) => {
        setRackDetail(res);
      });
  };

  const handleBreadCumb = () => {
    itemBreadcrumbs = [];
    var items = router.asPath.split("/").filter((_) => _ != "");
    var path = "";
    items.forEach((element) => {
      path += `/${element}`;
      itemBreadcrumbs.push({
        href: path,
        title: element,
      });
    });
  };

  useEffect(() => {
    if (router.query.rackId && session) {
      getData();
      handleBreadCumb();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, router.query.rackId]);
  return (
    <AntdLayoutNoSSR
      content={
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
        </>
      }
    />
  );
};

export default AreaDetail;
