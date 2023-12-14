"use client";
import BreadcrumbComponent from "@components/BreadcrumbComponent";
import RequestHostTable from "@components/server/requestHost/RequestHostTable";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import { getRequestHostData } from "@slices/requestHost";
import { Alert, FloatButton, Modal, Pagination, message } from "antd";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { RequestHostData, RequestHost } from "@models/requestHost";
import { ParamGet } from "@models/base";
import requestHostService from "@services/requestHost";
import { getRequestHostDataAll } from "@slices/requestHost";

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});
const { confirm } = Modal;
const RequestHostList: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: session } = useSession();
  const { requestHostData } = useSelector((state) => state.requestHost);

  const [paramGet, setParamGet] = useState<ParamGet>({
    PageIndex: 1,
    PageSize: 7,
  } as ParamGet);

  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [requestHost, setRequestHost] = useState<RequestHostData>();

  const [itemBreadcrumbs, setItemBreadcrumbs] = useState<ItemType[]>([]);

  const getData = async () => {
    dispatch(
      getRequestHostDataAll({
        token: session?.user.access_token!,
        paramGet: { ...paramGet },
      })
    ).then(({ payload }) => {
      var res = payload as RequestHostData;
      if (res.totalPage < paramGet.PageIndex && res.totalPage != 0) {
        setParamGet({ ...paramGet, PageIndex: res.totalPage });
      }
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
    session && getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, paramGet]);

  return (
    <AntdLayoutNoSSR
      content={
        <>
          <div className="flex flex-wrap items-center justify-between mb-4 p-2 bg-[#f8f9fa]/10 border border-gray-200 rounded-lg shadow-lg shadow-[#e7edf5]/50">
            <BreadcrumbComponent itemBreadcrumbs={itemBreadcrumbs} />
          </div>
          <RequestHostTable
            urlOncell=""
            onEdit={(record) => {}}
            onDelete={async (record) => {}}
          />
          {requestHostData?.totalPage > 0 && (
            <Pagination
              className="text-end m-4"
              current={paramGet?.PageIndex}
              pageSize={requestHostData?.pageSize ?? 10}
              total={requestHostData?.totalSize}
              onChange={(page, pageSize) => {
                setParamGet({
                  ...paramGet,
                  PageIndex: page,
                  PageSize: pageSize,
                });
              }}
            />
          )}
          {/* {Boolean(true) && (
            <FloatButton.Group
              trigger="hover"
              type="primary"
              style={{ right: 60, bottom: 500 }}
              icon={<AiOutlineFileDone />}
            >
              <FloatButton
                icon={<MdCancel color="red" />}
                tooltip="Fail"
                // onClick={() => setOpenFail(true)}
              />
              <FloatButton
                // onClick={() => setOpenComplete(true)}
                icon={<AiOutlineFileDone color="green" />}
                tooltip="Complete"
              />
            </FloatButton.Group>
          )} */}
        </>
      }
    />
  );
};

export default RequestHostList;
