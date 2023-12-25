"use client";
import { EditOutlined } from "@ant-design/icons";
import BreadcrumbComponent from "@components/BreadcrumbComponent";
import IpAddressTable from "@components/server/ipAddress/IpAddressTable";
import ModalAcceptRequestHost from "@components/server/requestHost/ModalAcceptRequestHost";
import ModalCompletetHost from "@components/server/requestHost/ModalCompleteHost";
import ModalDenyHost from "@components/server/requestHost/ModalDenyHost";
import ModalProvideIps from "@components/server/requestHost/ModalProvideIps";
import ModalRejectHost from "@components/server/requestHost/ModalRejectHost";
import ModalUpdate from "@components/server/requestHost/ModalUpdate";
import RequestHostDetailInfor from "@components/server/requestHost/RequestHostDetail";
import ServerDetail from "@components/server/ServerDetail";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import { ParamGetSuggestAdditional } from "@models/base";
import { SuggestAdditionalModel } from "@models/ipSubnet";
import {
  RequestHost,
  RequestHostUpdateModel,
  RUIpAdressParamGet,
} from "@models/requestHost";
import { ServerAllocation } from "@models/serverAllocation";
import ipSubnet from "@services/ipSubnet";
import requestHostService from "@services/requestHost";
import serverAllocationService from "@services/serverAllocation";
import { getIpAdressData } from "@slices/requestHost";
import { Alert, Button, FloatButton, message, Modal, Pagination } from "antd";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { AiOutlineFileDone } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import UploadComponent from "@components/UploadComponent";
import type { UploadFile } from "antd/es/upload/interface";
import { CaretLeftOutlined, UploadOutlined } from "@ant-design/icons";
import { ROLE_CUSTOMER, ROLE_SALES, ROLE_TECH } from "@utils/constants";
import { areInArray } from "@utils/helpers";

const { confirm } = Modal;
const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});
const RequestDetail: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const [serverAllocationDetail, setServerAllocationDetail] =
    useState<ServerAllocation>();
  const { ipAdressData } = useSelector((state) => state.requestHost);

  const [requestHostDetail, setRequestHostDetail] = useState<RequestHost>();
  const [provideIpsData, setProvideIpsData] =
    useState<SuggestAdditionalModel>();

  const [itemBreadcrumbs, setItemBreadcrumbs] = useState<ItemType[]>([]);
  const [requestHostUpdate, setRequestHostUpdate] = useState<RequestHost>();
  const [openModalDenyHost, setOpenModalDenyHost] = useState<boolean>(false);
  const [openModalRejectHost, setOpenModalRejectHost] =
    useState<boolean>(false);
  const [openModalCompleteHost, setOpenModalCompleteHost] =
    useState<boolean>(false);
  const [openModalAcceptHost, setOpenModalAcceptHost] =
    useState<boolean>(false);

  const [rUIpAddressParamGet, setRUIpAddressParamGet] =
    useState<RUIpAdressParamGet>({
      PageIndex: 1,
      PageSize: 10,
      RequestHostId: router.query.requestHostId ?? -1,
    } as unknown as RUIpAdressParamGet);

  const [provideIpsParamGet, setProvideIpsParamGet] =
    useState<ParamGetSuggestAdditional>({
      ServerAllocationId: router.query.serverAllocationId + "",
    } as unknown as ParamGetSuggestAdditional);

  const [fileInspectionReport, setFileInspectionReport] = useState<
    UploadFile[]
  >([]);
  const [loadingUploadDocument, setLoadingUploadDocument] =
    useState<boolean>(false);
  const [disabledInspectionReport, setDisabledInspectionReport] =
    useState<boolean>(false);

  const getData = async () => {
    await requestHostService
      .getDetail(session?.user.access_token!, router.query.requestHostId + "")
      .then(async (res) => {
        await serverAllocationService
          .getServerAllocationById(
            session?.user.access_token!,
            res.serverAllocationId + ""
          )
          .then((result) => {
            setServerAllocationDetail(result);
          });
        setRequestHostDetail(res);
      });
  };

  const updateData = async (data: RequestHostUpdateModel) => {
    await requestHostService
      .updateData(session?.user.access_token!, data)
      .then(async (res) => {
        message.success("Update successfully!");
        await requestHostService
          .getDetail(
            session?.user.access_token!,
            router.query.requestHostId + ""
          )
          .then(async (res) => {
            await serverAllocationService
              .getServerAllocationById(
                session?.user.access_token!,
                res.serverAllocationId + ""
              )
              .then((res) => {
                setServerAllocationDetail(res);
              });
            setRequestHostDetail(res);
            setRequestHostUpdate(undefined);
          });
        getData();
      })
      .catch((errors) => {
        message.error(errors.response.data);
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

  const getProvideIps = async () => {
    (provideIpsParamGet.ServerAllocationId = serverAllocationDetail?.id!),
      (provideIpsParamGet.Quantity = requestHostDetail?.quantity!),
      await ipSubnet
        .getSuggestAdditional(session?.user.access_token!, {
          ...provideIpsParamGet,
        })
        .then((res) => {
          setProvideIpsData(res);
        });
  };

  const uploadDocument = async () => {
    var data = new FormData();
    data.append("InspectionReport", fileInspectionReport[0].originFileObj!);
    data.append("InspectionReportFileName", fileInspectionReport[0].name!);
    setLoadingUploadDocument(true);
    await requestHostService
      .uploadDocument(
        session?.user.access_token!,
        requestHostDetail!.id.toString(),
        data
      )
      .then((res) => {
        message.success("Upload document successfully!");
        getData();
      })
      .catch((errors) => {
        message.error(errors.response.data);
      })
      .finally(() => {
        setLoadingUploadDocument(false);
        setFileInspectionReport([]);
      });
  };

  useEffect(() => {
    if (router.query.requestHostId && session) {
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  useEffect(() => {
    if (router.query.requestHostId && session) {
      getData();
      handleBreadCumb();
      rUIpAddressParamGet.Id = parseInt(router.query.requestHostId!.toString());
      dispatch(
        getIpAdressData({
          token: session?.user.access_token!,
          paramGet: { ...rUIpAddressParamGet },
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, rUIpAddressParamGet, router.query.requestHostId]);

  return (
    <AntdLayoutNoSSR
      content={
        <>
          {areInArray(session?.user.roles!, ROLE_TECH, ROLE_SALES) && (
            <>
              <div className="flex flex-wrap items-center justify-between mb-4 p-2 bg-[#f8f9fa]/10 border border-gray-200 rounded-lg shadow-lg shadow-[#e7edf5]/50">
                <BreadcrumbComponent itemBreadcrumbs={itemBreadcrumbs} />
                <div>
                  {Boolean(
                    requestHostDetail?.isRemoval != true &&
                      Boolean(
                        requestHostDetail?.status !== "Success" &&
                          requestHostDetail?.status !== "Failed" &&
                          requestHostDetail?.status !== "Waiting" &&
                          areInArray(session?.user.roles!, ROLE_TECH)
                      )
                  ) && (
                    <Button
                      type="primary"
                      className="mb-2 mr-3"
                      onClick={async () => {
                        getProvideIps();
                      }}
                    >
                      Provide Ips
                    </Button>
                  )}
                  {Boolean(
                    requestHostDetail?.status !== "Success" &&
                      requestHostDetail?.status !== "Failed" &&
                      areInArray(
                        session?.user.roles!,
                        ROLE_TECH,
                        ROLE_SALES,
                        ROLE_CUSTOMER
                      )
                  ) && (
                    <Button
                      type="primary"
                      className="mb-2"
                      icon={<EditOutlined />}
                      onClick={async () => {
                        setRequestHostUpdate(requestHostDetail);
                      }}
                    >
                      Update
                    </Button>
                  )}
                </div>
              </div>

              <div className="md:flex">
                <ServerDetail
                  serverAllocationDetail={serverAllocationDetail!}
                ></ServerDetail>
                <RequestHostDetailInfor
                  requestHostDetail={requestHostDetail!}
                />
              </div>
              {Boolean(
                requestHostDetail?.status === "Success" &&
                  !requestHostDetail.documentConfirm
              ) && (
                <div className="p-5">
                  <UploadComponent
                    fileList={fileInspectionReport}
                    title="BBNT"
                    setFileList={setFileInspectionReport}
                    multiple={false}
                    maxCount={1}
                    disabled={setDisabledInspectionReport}
                  />
                  <Button
                    icon={<UploadOutlined />}
                    loading={loadingUploadDocument}
                    className="w-full"
                    type="primary"
                    disabled={
                      !Boolean(fileInspectionReport.length > 0) ||
                      disabledInspectionReport
                    }
                    onClick={() => {
                      uploadDocument();
                    }}
                  >
                    Upload
                  </Button>
                </div>
              )}

              <IpAddressTable typeGet="RequestHost" urlOncell="" />
              {ipAdressData?.totalPage > 0 && (
                <Pagination
                  className="text-end m-4"
                  current={rUIpAddressParamGet?.PageIndex}
                  pageSize={ipAdressData?.pageSize ?? 10}
                  total={ipAdressData?.totalSize}
                  onChange={(page, pageSize) => {
                    setRUIpAddressParamGet({
                      ...rUIpAddressParamGet,
                      PageIndex: page,
                      PageSize: pageSize,
                    });
                  }}
                />
              )}

              {Boolean(
                requestHostDetail?.status === "Waiting" &&
                  areInArray(session?.user.roles!, ROLE_SALES)
              ) && (
                <FloatButton.Group
                  trigger="hover"
                  type="primary"
                  style={{ right: 60, bottom: 505 }}
                  icon={<AiOutlineFileDone />}
                >
                  <FloatButton
                    icon={<MdCancel color="red" />}
                    tooltip="Deny"
                    onClick={() => setOpenModalDenyHost(true)}
                  />
                  <FloatButton
                    onClick={() => setOpenModalAcceptHost(true)}
                    icon={<AiOutlineFileDone color="green" />}
                    tooltip="Accept"
                  />
                </FloatButton.Group>
              )}

              {Boolean(
                requestHostDetail?.status === "Accepted" &&
                  areInArray(session?.user.roles!, ROLE_TECH)
              ) && (
                <FloatButton.Group
                  trigger="hover"
                  type="primary"
                  style={{ right: 60, bottom: 500 }}
                  icon={<AiOutlineFileDone />}
                >
                  <FloatButton
                    icon={<MdCancel color="red" />}
                    tooltip="Fail"
                    onClick={() => setOpenModalRejectHost(true)}
                  />
                  {Boolean(ipAdressData?.data?.length > 0) && (
                    <FloatButton
                      onClick={() => setOpenModalCompleteHost(true)}
                      icon={<AiOutlineFileDone color="green" />}
                      tooltip="Complete"
                    />
                  )}
                </FloatButton.Group>
              )}
              <ModalUpdate
                requestHost={requestHostUpdate!}
                onClose={() => {
                  setRequestHostUpdate(undefined);
                }}
                onSubmit={(value) => {
                  updateData(value);
                }}
              />
              <ModalDenyHost
                open={openModalDenyHost}
                onClose={() => setOpenModalDenyHost(false)}
                requestHostId={requestHostDetail?.id!}
                getData={() => getData()}
              />

              <ModalCompletetHost
                requestHostId={requestHostDetail?.id!}
                onRefresh={() => getData()}
                open={openModalCompleteHost}
                onClose={() => setOpenModalCompleteHost(false)}
              />

              <ModalRejectHost
                requestHostId={requestHostDetail?.id!}
                onRefresh={() => getData()}
                open={openModalRejectHost}
                onClose={() => setOpenModalRejectHost(false)}
              />

              <ModalAcceptRequestHost
                open={openModalAcceptHost}
                onClose={() => setOpenModalAcceptHost(false)}
                requestHostId={requestHostDetail?.id!}
                getData={() => getData()}
              />

              <ModalProvideIps
                provideIpsData={provideIpsData!}
                quantity={requestHostDetail?.quantity!}
                requestHostId={requestHostDetail?.id!}
                onClose={() => setProvideIpsData(undefined)}
                onRefresh={() => getData()}
              />
            </>
          )}
        </>
      }
    />
  );
};

export default RequestDetail;
