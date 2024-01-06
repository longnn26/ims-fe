"use client";
import BreadcrumbComponent from "@components/BreadcrumbComponent";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import {
  Appointment,
  AppointmentComplete,
  ParamGetExtend,
} from "@models/appointment";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import appointmentService from "@services/appointment";
import requestUpgradeService from "@services/requestUpgrade";
import { CaretLeftOutlined, UploadOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import AppointmentDetail from "@components/appointment/AppointmentDetail";
import {
  Alert,
  Button,
  FloatButton,
  Modal,
  Pagination,
  Tabs,
  TabsProps,
  message,
} from "antd";
import UploadComponent from "@components/UploadComponent";
import type { UploadFile } from "antd/es/upload/interface";
import {
  getRequestExpandData,
  getRequestUpgradeData,
} from "@slices/appointment";
import RequestUpgradeTable from "@components/server/requestUpgrade/RequestUpgradeTable";
import { AiOutlineFileDone } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import {
  RUAppointmentParamGet,
  RequestUpgrade,
  RequestUpgradeUpdateModel,
} from "@models/requestUpgrade";
import ModalUpdate from "@components/server/requestUpgrade/ModalUpdate";
import ModalComplete from "@components/appointment/ModalComplete";
import ModalFail from "@components/appointment/ModalFail";
import RequestExpandTable from "@components/server/requestExpand/RequestExpandTable";
import ModalAccept from "@components/appointment/ModalAccept";
import ModalDeny from "@components/appointment/ModalDeny";
import { areInArray } from "@utils/helpers";
import { ROLE_CUSTOMER, ROLE_SALES, ROLE_TECH } from "@utils/constants";
import ModalUpdateDocument from "@components/appointment/ModalUpdateDocument";
const { confirm } = Modal;
const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});

const Appoinment: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: session } = useSession();
  const [itemBreadcrumbs, setItemBreadcrumbs] = useState<ItemType[]>([]);
  const [appointmentDetail, setAppointmentDetail] = useState<Appointment>();
  const [fileInspectionReport, setFileInspectionReport] = useState<
    UploadFile[]
  >([]);
  const [fileReceiptOfRecipient, setFileReceiptOfRecipient] = useState<
    UploadFile[]
  >([]);
  const [paramGet, setParamGet] = useState<RUAppointmentParamGet>({
    PageIndex: 1,
    PageSize: 10,
    AppoinmentId: router.query.appointmentId,
  } as unknown as RUAppointmentParamGet);

  const [loadingUploadDocument, setLoadingUploadDocument] =
    useState<boolean>(false);
  const [disabledReceiptOfRecipient, setDisabledReceiptOfRecipient] =
    useState<boolean>(false);
  const [disabledInspectionReport, setDisabledInspectionReport] =
    useState<boolean>(false);
  const [requestUpgradeUpdate, setRequestUpgradeUpdate] = useState<
    RequestUpgrade | undefined
  >(undefined);

  const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
  const [openModalDeny, setOpenModalDeny] = useState<boolean>(false);
  const [openModalAccept, setOpenModalAccept] = useState<boolean>(false);
  const [openComplete, setOpenComplete] = useState<boolean>(false);
  const [openUpdateDocument, setOpenUpdateDocument] = useState<boolean>(false);
  const [openFail, setOpenFail] = useState<boolean>(false);
  const { requestUpgradeData, requestExpandData } = useSelector(
    (state) => state.appointment
  );

  const getData = async () => {
    await appointmentService
      .getDetail(session?.user.access_token!, router.query.appointmentId + "")
      .then((res) => {
        setAppointmentDetail(res);
      });
  };

  const uploadDocument = async () => {
    var data = new FormData();
    data.append("InspectionReport", fileInspectionReport[0].originFileObj!);
    data.append("InspectionReportFileName", fileInspectionReport[0].name!);
    data.append("ReceiptOfRecipient", fileReceiptOfRecipient[0].originFileObj!);
    data.append("ReceiptOfRecipientFileName", fileReceiptOfRecipient[0].name!);
    setLoadingUploadDocument(true);
    await appointmentService
      .uploadDocument(
        session?.user.access_token!,
        appointmentDetail!.id.toString(),
        data
      )
      .then((res) => {
        message.success("Upload document successfully!", 1.5);
        getData();
      })
      .catch((errors) => {
        message.error(errors.response.data, 1.5);
      })
      .finally(() => {
        setLoadingUploadDocument(false);
        setFileInspectionReport([]);
        setFileReceiptOfRecipient([]);
      });
  };

  const completeAppointment = async (data: AppointmentComplete) => {
    await appointmentService
      .completeAppointment(
        session?.user.access_token!,
        appointmentDetail?.id!,
        data
      )
      .then((res) => {
        message.success("Complete appointment successfully!", 1.5);
        getData();
      })
      .catch((errors) => {
        message.error(errors.response.data, 1.5);
      })
      .finally(() => {
        setOpenComplete(false);
      });
  };

  const failAppointment = async (data: string) => {
    await appointmentService
      .failAppointment(
        session?.user.access_token!,
        appointmentDetail?.id + "",
        data
      )
      .then((res) => {
        message.success("Fail appointment successfully!", 1.5);
        getData();
      })
      .catch((errors) => {
        message.error(errors.response.data, 1.5);
      })
      .finally(() => {});
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

  const updateRequestUpgrade = async (data: RequestUpgradeUpdateModel) => {
    await requestUpgradeService
      .updateData(session?.user.access_token!, data)
      .then((res) => {
        message.success("Update successfully!", 1.5);
        getData();
      })
      .catch((errors) => {
        message.error(errors.response.data, 1.5);
      })
      .finally(() => {
        setRequestUpgradeUpdate(undefined);
      });
  };

  useEffect(() => {
    if (router.query.appointmentId && session) {
      getData();
      handleBreadCumb();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  useEffect(() => {
    if (router.query.appointmentId && session) {
      getData();
      handleBreadCumb();
      paramGet.AppointmentId = parseInt(router.query.appointmentId!.toString());
      dispatch(
        getRequestUpgradeData({
          token: session?.user.access_token!,
          paramGet: { ...paramGet },
        })
      );

      dispatch(
        getRequestExpandData({
          token: session?.user.access_token!,
          paramGet: { ...paramGet },
        })
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, paramGet, router.query.appointmentId]);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Hardware Upgrade request",
      children: (
        <>
          <RequestUpgradeTable
            urlOncell=""
            typeGet="ByAppointmentId"
            onEdit={(value) => {
              setRequestUpgradeUpdate(value);
            }}
            onDelete={(value) => {}}
          />
          {requestUpgradeData?.totalPage > 0 && (
            <Pagination
              className="text-end m-4"
              current={paramGet?.PageIndex}
              pageSize={requestUpgradeData?.pageSize ?? 10}
              total={requestUpgradeData?.totalSize}
              onChange={(page, pageSize) => {
                setParamGet({
                  ...paramGet,
                  PageIndex: page,
                  PageSize: pageSize,
                });
              }}
            />
          )}
        </>
      ),
    },
    {
      key: "2",
      label: "Rack Expansion request",
      children: (
        <>
          <RequestExpandTable
            urlOncell=""
            typeGet="ByAppointmentId"
            onEdit={(value) => {
              // setRequestUpgradeUpdate(value);
            }}
            onDelete={(value) => {}}
          />
          {requestExpandData?.totalPage > 0 && (
            <Pagination
              className="text-end m-4"
              current={paramGet?.PageIndex}
              pageSize={requestExpandData?.pageSize ?? 10}
              total={requestExpandData?.totalSize}
              onChange={(page, pageSize) => {
                setParamGet({
                  ...paramGet,
                  PageIndex: page,
                  PageSize: pageSize,
                });
              }}
            />
          )}
        </>
      ),
    },
  ];
  return (
    <AntdLayoutNoSSR
      content={
        <>
          {areInArray(
            session?.user.roles!,
            ROLE_TECH,
            ROLE_SALES,
            ROLE_CUSTOMER
          ) && (
            <>
              <div className="scroll-auto flex flex-wrap items-center justify-between mb-4 p-2 bg-[#f8f9fa]/10 border border-gray-200 rounded-lg shadow-lg shadow-[#e7edf5]/50">
                <div>
                  <Button
                    type="primary"
                    icon={<CaretLeftOutlined />}
                    onClick={() => router.back()}
                  ></Button>
                  <div className="flex items-center">
                    <BreadcrumbComponent itemBreadcrumbs={itemBreadcrumbs} />
                  </div>
                </div>
                {Boolean(
                  appointmentDetail?.status === "Success" &&
                    !appointmentDetail.documentConfirm &&
                    areInArray(session?.user.roles!, ROLE_SALES, ROLE_TECH)
                ) && (
                  <>
                    <Button
                      type="primary"
                      className="mb-2"
                      // icon={<CaretLeftOutlined />}
                      onClick={() => setOpenUpdateDocument(true)}
                    >
                      Update Report
                    </Button>
                  </>
                )}
                <AppointmentDetail appointmentDetail={appointmentDetail!} />
                {Boolean(
                  appointmentDetail?.status === "Success" &&
                    appointmentDetail.serverAllocation.status !== "Waiting"
                  // && !appointmentDetail.documentConfirm
                ) && (
                  <>
                    <div className="w-full md:m-5 md:flex">
                      <div className="md:w-1/2 md:pr-5">
                        <UploadComponent
                          fileList={fileInspectionReport}
                          title="Inspection report (Signed)"
                          setFileList={setFileInspectionReport}
                          multiple={false}
                          maxCount={1}
                          disabled={setDisabledInspectionReport}
                        />
                      </div>
                      <div className="md:w-1/2 md:pl-5 h-28">
                        <UploadComponent
                          fileList={fileReceiptOfRecipient}
                          title="Receipt of recipient (Signed)"
                          setFileList={setFileReceiptOfRecipient}
                          multiple={false}
                          maxCount={1}
                          disabled={setDisabledReceiptOfRecipient}
                        />
                      </div>
                    </div>
                    <Button
                      icon={<UploadOutlined />}
                      loading={loadingUploadDocument}
                      className="w-full m-5"
                      type="primary"
                      disabled={
                        !Boolean(
                          fileInspectionReport.length > 0 &&
                            fileReceiptOfRecipient.length > 0
                        ) ||
                        disabledInspectionReport ||
                        disabledReceiptOfRecipient
                      }
                      onClick={() => {
                        uploadDocument();
                      }}
                    >
                      Upload
                    </Button>
                  </>
                )}
              </div>

              {Boolean(
                appointmentDetail?.status === "Waiting" &&
                  areInArray(session?.user.roles!, ROLE_SALES)
              ) && (
                <>
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
                  <ModalAccept
                    open={openModalAccept}
                    onClose={() => setOpenModalAccept(false)}
                    appointmentId={appointmentDetail?.id!}
                    getData={() => getData()}
                  />
                </>
              )}

              <Tabs className="m-5" defaultActiveKey="1" items={items} />
              <ModalComplete
                open={openComplete}
                appointment={appointmentDetail!}
                onSubmit={() => {
                  setOpenComplete(false);
                  getData();
                }}
                onClose={() => setOpenComplete(false)}
              />
              <ModalUpdateDocument
                open={openUpdateDocument}
                appointment={appointmentDetail!}
                onSubmit={() => {
                  getData();
                  setOpenUpdateDocument(false);
                }}
                onClose={() => setOpenUpdateDocument(false)}
              />
              <ModalFail
                open={openFail}
                onSubmit={(value) => failAppointment(value)}
                onClose={() => setOpenFail(false)}
              />
              <ModalDeny
                open={openModalDeny}
                onClose={() => setOpenModalDeny(false)}
                appointmentId={appointmentDetail?.id!}
                getData={() => getData()}
              />

              {Boolean(
                appointmentDetail?.status === "Accepted" &&
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
                    onClick={() => setOpenFail(true)}
                  />
                  <FloatButton
                    onClick={() => setOpenComplete(true)}
                    icon={<AiOutlineFileDone color="green" />}
                    tooltip="Complete"
                  />
                </FloatButton.Group>
              )}
            </>
          )}
        </>
      }
    />
  );
};

export default Appoinment;
