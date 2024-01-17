"use client";
import BreadcrumbComponent from "@components/BreadcrumbComponent";
import ServerDetail from "@components/server/ServerDetail";
import RequestExpandDetailInfor from "@components/server/requestExpand/RequestExpandDetail";
import {
  RequestedLocation,
  RequestExpand,
  RequestExpandUpdateModel,
  SuggestLocation,
} from "@models/requestExpand";
import { RUAppointmentParamGet } from "@models/requestUpgrade";
import { ServerAllocation } from "@models/serverAllocation";
import requestExpandService from "@services/requestExpand";
import serverAllocationService from "@services/serverAllocation";
import { getAppointmentData } from "@slices/requestExpand";
import {
  Alert,
  Button,
  Empty,
  FloatButton,
  Modal,
  Pagination,
  message,
} from "antd";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { AiOutlineFileDone } from "react-icons/ai";
import { EditOutlined } from "@ant-design/icons";
import { MdCancel } from "react-icons/md";
import useSelector from "@hooks/use-selector";
import useDispatch from "@hooks/use-dispatch";
import AppointmentTable from "@components/server/requestUpgrade/AppointmentTable";
import ModalUpdate from "@components/server/requestExpand/ModalUpdate";
import { areInArray } from "@utils/helpers";
import {
  ROLE_CUSTOMER,
  ROLE_MANAGER,
  ROLE_SALES,
  ROLE_TECH,
} from "@utils/constants";
import ModalEmpty from "@components/ModalEmpty";
import ModalDeny from "@components/server/requestExpand/ModalDeny";
import serverHardwareConfig from "@services/serverHardwareConfig";
import {
  ServerHardwareConfigData,
  SHCParamGet,
} from "@models/serverHardwareConfig";
import ModalAcceptExpand from "@components/server/requestExpand/ModalAccept";

const { confirm } = Modal;
const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});

const RequestExpandDetail: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const [serverAllocationDetail, setServerAllocationDetail] =
    useState<ServerAllocation>();
  const [requestExpandDetail, setRequestExpandDetail] =
    useState<RequestExpand>();

  const [rUAppointmentParamGet, setRUAppointmentParamGet] =
    useState<RUAppointmentParamGet>({
      PageIndex: 1,
      PageSize: 10,
      RequestExpandId: router.query.requestExpandId ?? -1,
    } as unknown as RUAppointmentParamGet);

  const [itemBreadcrumbs, setItemBreadcrumbs] = useState<ItemType[]>([]);
  const [suggestLocation, setSuggestLocation] = useState<SuggestLocation>();
  const [requestExpandUpdate, setRequestExpandUpdate] =
    useState<RequestExpand>();
  const { appointmentData } = useSelector((state) => state.requestExpand);
  const [openModalDeny, setOpenModalDeny] = useState<boolean>(false);
  const [openModalAccept, setOpenModalAccept] = useState<boolean>(false);

  const [permission, setPermission] = useState<boolean>(true);
  const [content, setContent] = useState<string>("");
  const [paramGet, setParamGet] = useState<SHCParamGet>({
    PageIndex: 1,
    PageSize: 10,
  } as unknown as SHCParamGet);
  const [hardware, setHardware] = useState<ServerHardwareConfigData>();

  const getData = async () => {
    await requestExpandService
      .getDetail(session?.user.access_token!, router.query.requestExpandId + "")
      .then((res) => {
        setRequestExpandDetail(res);
      })
      .catch((errors) => {
        setRequestExpandDetail(undefined);
        setContent(errors.response.data);
      });
    await serverAllocationService
      .getServerAllocationById(
        session?.user.access_token!,
        router.query.serverAllocationId + ""
      )
      .then(async (res) => {
        setServerAllocationDetail(res);
        await serverHardwareConfig
          .getServerHardwareConfigData(session?.user.access_token!, {
            ...paramGet,
            ServerAllocationId: res.id,
          } as SHCParamGet)
          .then((res) => {
            setHardware(res);
          });
        // checkPermission();
      })
      .catch((errors) => {
        setServerAllocationDetail(undefined);
        setContent(errors.response.data);
      });
  };

  const checkPermission = () => {
    if (
      requestExpandDetail?.serverAllocation.id + "" !==
      router.query.serverAllocationId
    ) {
      setPermission(false);
    } else {
      setPermission(true);
    }
  };

  const rejectRequestExpand = async () => {
    confirm({
      title: "Reject",
      content: (
        <Alert
          message={`Do you want to reject with Id ${requestExpandDetail?.id}?`}
          type="warning"
        />
      ),
      async onOk() {
        await requestExpandService
          .rejectRequestExpand(
            session?.user.access_token!,
            requestExpandDetail?.id + ""
          )
          .then((res) => {
            message.success(
              "Reject Server Allocation Request successfully!",
              1.5
            );
            getData();
          })
          .catch((errors) => {
            message.error(errors.response.data, 1.5);
          })
          .finally(() => { });
      },
      onCancel() { },
    });
  };

  const completeRequestExpand = async () => {
    confirm({
      title: "Complete",
      content: (
        <Alert
          message={`Do you want to complete with Id ${requestExpandDetail?.id}?`}
          type="warning"
        />
      ),
      async onOk() {
        await requestExpandService
          .completeRequestExpand(
            session?.user.access_token!,
            requestExpandDetail?.id + ""
          )
          .then((res) => {
            message.success(
              "Complete Server Allocation Request successfully!",
              1.5
            );
            getData();
          })
          .catch((errors) => {
            message.error(errors.response.data, 1.5);
          })
          .finally(() => { });
      },
      onCancel() { },
    });
  };

  const acceptRequestExpand = async (data: string) => {
    confirm({
      title: "Accept",
      content: (
        <Alert
          message={`Do you want to accept with Id ${requestExpandDetail?.id}?`}
          type="warning"
        />
      ),
      async onOk() {
        await requestExpandService
          .acceptRequestExpand(
            session?.user.access_token!,
            requestExpandDetail?.id + "",
            data
          )
          .then((res) => {
            message.success(
              "Accept Server Allocation Request successfully!",
              1.5
            );
            getData();
          })
          .catch((errors) => {
            message.error(errors.response.data, 1.5);
          })
          .finally(() => { });
      },
      onCancel() { },
    });
  };

  const updateData = async (data: RequestExpandUpdateModel) => {
    await requestExpandService
      .updateData(session?.user.access_token!, data)
      .then(async (res) => {
        message.success("Update successfully!", 1.5);
        await requestExpandService
          .getDetail(
            session?.user.access_token!,
            router.query.requestExpandId + ""
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
            setRequestExpandDetail(res);
            setRequestExpandDetail(res);
            setRequestExpandUpdate(res);
            if (!res?.requestedLocation && res?.size! > 0) {
              await requestExpandService
                .getSuggestLocation(
                  session?.user.access_token!,
                  requestExpandDetail?.id!
                )
                .then((res) => {
                  setSuggestLocation(res);
                })
                .catch((e) => { });
            }
          });
        // getData();
      })
      .catch((errors) => {
        message.error(errors.response.data, 1.5);
      });
  };

  const saveLocation = async (data: RequestedLocation) => {
    await requestExpandService
      .saveLocation(session?.user.access_token!, requestExpandUpdate?.id!, data)
      .then(async (res) => {
        message.success("Save location successfully!", 1.5);
        getData();
      })
      .catch((errors) => {
        message.error(errors.response.data, 1.5);
      })
      .finally(() => {
        setRequestExpandUpdate(undefined);
      });
  };

  const handleBreadCumb = () => {
    var itemBrs = [] as ItemType[];
    var items = router.asPath.split("/").filter((_) => _ != "");
    var path = "";
    items.forEach((element) => {
      switch (element) {
        case serverAllocationDetail?.id + "":
          path += `/${element}`;
          itemBrs.push({
            href: path,
            title: serverAllocationDetail?.name,
          });
          break;
        case requestExpandDetail?.id + "":
          path += `/${element}`;
          itemBrs.push({
            href: path,
            title: "Detail Information",
          });
          break;
        default:
          path += `/${element}`;
          itemBrs.push({
            href: path,
            title: element,
          });
          break;
      }
    });
    setItemBreadcrumbs(itemBrs);
  };

  useEffect(() => {
    if (router.query.serverAllocationId && session) {
      handleBreadCumb();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverAllocationDetail]);

  useEffect(() => {
    if (router.query.serverAllocationId && session) {
      getData();
      handleBreadCumb();
    }
  }, [session]);

  useEffect(() => {
    if (router.query.requestExpandId && session) {
      handleBreadCumb();
      rUAppointmentParamGet.Id = parseInt(
        router.query.requestExpandId!.toString()
      );
      dispatch(
        getAppointmentData({
          token: session?.user.access_token!,
          paramGet: { ...rUAppointmentParamGet },
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, rUAppointmentParamGet]);

  useEffect(() => {
    checkPermission();
    handleBreadCumb();
  }, [requestExpandDetail]);

  if (requestExpandDetail === undefined) {
    return (
      <AntdLayoutNoSSR
        content={
          <>
            <ModalEmpty isPermission={false} content={content} />
          </>
        }
      />
    );
  } else
    return (
      <AntdLayoutNoSSR
        content={
          <>
            {!permission ? (
              <ModalEmpty isPermission={true} content={content} />
            ) : (
              <div className="flex flex-wrap items-center justify-between mb-4 p-2 bg-[#f8f9fa]/10 border border-gray-200 rounded-lg shadow-lg shadow-[#e7edf5]/50">
                <BreadcrumbComponent itemBreadcrumbs={itemBreadcrumbs} />

                {Boolean(
                  requestExpandDetail?.requestType !== "RemoveLocation" &&
                  requestExpandDetail?.status === "Accepted" &&
                  requestExpandDetail.chosenLocation === null &&
                  areInArray(session?.user.roles!, ROLE_TECH)
                ) &&
                  permission && (
                    <>
                      <div>
                        <Button
                          type="primary"
                          className="mb-2"
                          icon={<EditOutlined />}
                          onClick={async () => {
                            setRequestExpandUpdate(requestExpandDetail);
                            if (
                              !requestExpandDetail?.requestedLocation &&
                              requestExpandDetail?.size! > 0
                            ) {
                              await requestExpandService
                                .getSuggestLocation(
                                  session?.user.access_token!,
                                  requestExpandDetail?.id!
                                )
                                .then((res) => {
                                  setSuggestLocation(res);
                                })
                                .catch((e) => { });
                            }
                          }}
                        >
                          Update
                        </Button>
                      </div>
                    </>
                  )}
              </div>
            )}
            <ModalDeny
              open={openModalDeny}
              onClose={() => setOpenModalDeny(false)}
              onSubmit={() => {
                getData();
                setOpenModalDeny(false);
              }}
              requestExpandId={parseInt(router.query.requestExpandId + "")}
            />
            <ModalAcceptExpand
              open={openModalAccept}
              onClose={() => setOpenModalAccept(false)}
              onSubmit={() => {
                getData();
                setOpenModalAccept(false);
              }}
              requestExpandId={parseInt(router.query.requestExpandId + "")}
            />
            {areInArray(
              session?.user.roles!,
              ROLE_SALES,
              ROLE_TECH,
              ROLE_CUSTOMER,
              ROLE_MANAGER
            ) &&
              permission && (
                <>
                  <div className="md:flex">
                    <ServerDetail
                      serverAllocationDetail={serverAllocationDetail!}
                      hardware={hardware!}
                    ></ServerDetail>
                    <RequestExpandDetailInfor
                      requestExpandDetail={requestExpandDetail!}
                    />
                  </div>

                  <AppointmentTable
                    typeGet="ByRequestExpandId"
                    urlOncell=""
                    onEdit={(record) => { }}
                    onDelete={async (record) => { }}
                  />
                  {appointmentData?.totalPage > 0 && (
                    <Pagination
                      className="text-end m-4"
                      current={rUAppointmentParamGet?.PageIndex}
                      pageSize={appointmentData?.pageSize ?? 10}
                      total={appointmentData?.totalSize}
                      onChange={(page, pageSize) => {
                        setRUAppointmentParamGet({
                          ...rUAppointmentParamGet,
                          PageIndex: page,
                          PageSize: pageSize,
                        });
                      }}
                    />
                  )}

                  {Boolean(
                    requestExpandDetail?.status === "Waiting" &&
                    areInArray(session?.user.roles!, ROLE_SALES)
                  ) && (
                      <FloatButton.Group
                        trigger="hover"
                        type="primary"
                        style={{ right: 60, bottom: 500 }}
                        icon={<AiOutlineFileDone />}
                      >
                        <FloatButton
                          icon={<MdCancel color="red" />}
                          tooltip="Deny"
                          onClick={() => setOpenModalDeny(true)}
                        />
                        <FloatButton
                          onClick={() => setOpenModalAccept(true)}
                          icon={<AiOutlineFileDone color="green" />}
                          tooltip="Accept"
                        />
                      </FloatButton.Group>
                    )}
                  {Boolean(
                    requestExpandDetail?.status === "Accepted" &&
                    requestExpandDetail?.succeededAppointment?.status ===
                    "Success"
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
                          onClick={() => rejectRequestExpand()}
                        />
                        <FloatButton
                          onClick={() => completeRequestExpand()}
                          icon={<AiOutlineFileDone color="green" />}
                          tooltip="Complete"
                        />
                      </FloatButton.Group>
                    )}
                  <ModalUpdate
                    onSaveLocation={(data) => saveLocation(data)}
                    suggestLocation={suggestLocation}
                    requestExpand={requestExpandUpdate!}
                    onClose={() => {
                      setRequestExpandUpdate(undefined);
                      setSuggestLocation(undefined);
                    }}
                    onSubmit={(value) => {
                      updateData(value);
                    }}
                  />
                </>
              )}
          </>
        }
      />
    );
};

export default RequestExpandDetail;
