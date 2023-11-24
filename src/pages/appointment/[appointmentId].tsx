"use client";
import BreadcrumbComponent from "@components/BreadcrumbComponent";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import { Appointment, ParamGetExtend } from "@models/appointment";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import appointmentService from "@services/appointment";
import requestUpgradeService from "@services/requestUpgrade";
import { CaretLeftOutlined, UploadOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import AppointmentDetail from "@components/appointment/AppointmentDetail";
import { Button, FloatButton, Pagination, message } from "antd";
import UploadComponent from "@components/UploadComponent";
import type { UploadFile } from "antd/es/upload/interface";
import { getRequestUpgradeData } from "@slices/appointment";
import RequestUpgradeTable from "@components/server/requestUpgrade/RequestUpgradeTable";
import { AiOutlineFileDone } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import {
  RequestUpgrade,
  RequestUpgradeUpdateModel,
} from "@models/requestUpgrade";
import ModalUpdate from "@components/server/requestUpgrade/ModalUpdate";

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
  const [paramGetExtend, setParamGetExtend] = useState<ParamGetExtend>({
    PageIndex: 1,
    PageSize: 10,
    id: router.query.appointmentId,
  } as unknown as ParamGetExtend);
  const [loadingUploadDocument, setLoadingUploadDocument] =
    useState<boolean>(false);
  const [disabledReceiptOfRecipient, setDisabledReceiptOfRecipient] =
    useState<boolean>(false);
  const [disabledInspectionReport, setDisabledInspectionReport] =
    useState<boolean>(false);
  const [requestUpgradeUpdate, setRequestUpgradeUpdate] = useState<
    RequestUpgrade | undefined
  >(undefined);
  const { requestUpgradeData } = useSelector((state) => state.appointment);

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
        message.success("Upload document successful!");
        getData();
      })
      .catch((errors) => {
        message.error(errors.message);
      })
      .finally(() => {
        setLoadingUploadDocument(false);
        setFileInspectionReport([]);
        setFileReceiptOfRecipient([]);
      });
  };

  const acceptAppointment = async () => {
    await appointmentService
      .acceptAppointment(
        session?.user.access_token!,
        appointmentDetail?.id + ""
      )
      .then((res) => {
        message.success("Accept appointment successful!");
        getData();
      })
      .catch((errors) => {
        message.error(errors.message);
      })
      .finally(() => {});
  };

  const denyAppointment = async () => {
    await appointmentService
      .denyAppointment(session?.user.access_token!, appointmentDetail?.id + "")
      .then((res) => {
        message.success("Deny appointment successful!");
        getData();
      })
      .catch((errors) => {
        message.error(errors.message);
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
        message.success("Update successful!");
        getData();
      })
      .catch((errors) => {
        message.error(errors.message);
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
      paramGetExtend.Id = parseInt(router.query.appointmentId!.toString());
      dispatch(
        getRequestUpgradeData({
          token: session?.user.access_token!,
          paramGet: { ...paramGetExtend },
        })
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, paramGetExtend]);

  return (
    <AntdLayoutNoSSR
      content={
        <>
          <div className="scroll-auto flex flex-wrap items-center justify-between mb-4 p-2 bg-[#f8f9fa]/10 border border-gray-200 rounded-lg shadow-lg shadow-[#e7edf5]/50">
            <div>
              <Button
                type="primary"
                className="mb-2"
                icon={<CaretLeftOutlined />}
                onClick={() => router.back()}
              ></Button>
              <BreadcrumbComponent itemBreadcrumbs={itemBreadcrumbs} />
            </div>
            <AppointmentDetail appointmentDetail={appointmentDetail!} />
            <div className="w-full md:m-5 md:flex">
              <div className="md:w-1/2 md:pr-5">
                <UploadComponent
                  fileList={fileInspectionReport}
                  title="Inspection report"
                  setFileList={setFileInspectionReport}
                  multiple={false}
                  maxCount={1}
                  disabled={setDisabledInspectionReport}
                />
              </div>
              <div className="md:w-1/2 md:pl-5 h-28">
                <UploadComponent
                  fileList={fileReceiptOfRecipient}
                  title="Receipt of recipient"
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
          </div>
          <RequestUpgradeTable
            urlOncell=""
            typeGet="ByAppointmentId"
            onEdit={(value) => {
              setRequestUpgradeUpdate(value);
            }}
            onDelete={(value) => {}}
          />
          {requestUpgradeData.totalPage > 0 && (
            <Pagination
              className="text-end m-4"
              current={paramGetExtend?.PageIndex}
              pageSize={requestUpgradeData?.pageSize ?? 10}
              total={requestUpgradeData?.totalSize}
              onChange={(page, pageSize) => {
                setParamGetExtend({
                  ...paramGetExtend,
                  PageIndex: page,
                  PageSize: pageSize,
                });
              }}
            />
          )}

          <ModalUpdate
            requestUpgrade={requestUpgradeUpdate!}
            onClose={() => setRequestUpgradeUpdate(undefined)}
            onSubmit={(data: RequestUpgradeUpdateModel) => {
              updateRequestUpgrade(data);
            }}
          />

          {appointmentDetail?.status === "Waiting" && (
            <FloatButton.Group
              trigger="hover"
              type="primary"
              style={{ right: 60, bottom: 500 }}
              icon={<AiOutlineFileDone />}
            >
              <FloatButton
                icon={<MdCancel color="red" />}
                tooltip="Deny"
                onClick={() => denyAppointment()}
              />
              <FloatButton
                onClick={() => acceptAppointment()}
                icon={<AiOutlineFileDone color="green" />}
                tooltip="Accept"
              />
            </FloatButton.Group>
          )}
        </>
      }
    />
  );
};

export default Appoinment;
