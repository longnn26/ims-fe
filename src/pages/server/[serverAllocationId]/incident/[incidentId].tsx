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
import incidentService from "@services/incident";
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
import { ROLE_CUSTOMER, ROLE_SALES, ROLE_TECH } from "@utils/constants";
import ModalEmpty from "@components/ModalEmpty";
import ModalDeny from "@components/server/requestExpand/ModalDeny";
import serverHardwareConfig from "@services/serverHardwareConfig";
import {
  ServerHardwareConfigData,
  SHCParamGet,
} from "@models/serverHardwareConfig";
import { Incident } from "@models/incident";
import IncidentDetailInfo from "@components/server/incident/IncidentDetail";
import ModalResolve from "@components/server/incident/ModalResolve";

const { confirm } = Modal;
const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});

const IncidentDetail: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const [serverAllocationDetail, setServerAllocationDetail] =
    useState<ServerAllocation>();
  const [incidentDetail, setIncidentDetail] = useState<Incident>();

  const [rUAppointmentParamGet, setRUAppointmentParamGet] =
    useState<RUAppointmentParamGet>({
      PageIndex: 1,
      PageSize: 10,
      RequestExpandId: router.query.requestExpandId ?? -1,
    } as unknown as RUAppointmentParamGet);

  const [itemBreadcrumbs, setItemBreadcrumbs] = useState<ItemType[]>([]);
  const [requestExpandUpdate, setRequestExpandUpdate] =
    useState<RequestExpand>();
  const { appointmentData } = useSelector((state) => state.requestExpand);
  const [openModalResolve, setOpenModalResolve] = useState<boolean>(false);

  const [permission, setPermission] = useState<boolean>(true);
  const [content, setContent] = useState<string>("");
  const [paramGet, setParamGet] = useState<SHCParamGet>({
    PageIndex: 1,
    PageSize: 10,
  } as unknown as SHCParamGet);
  const [hardware, setHardware] = useState<ServerHardwareConfigData>();

  const getData = async () => {
    await incidentService
      .getDetail(session?.user.access_token!, router.query.incidentId + "")
      .then((res) => {
        setIncidentDetail(res);
      })
      .catch((errors) => {
        setIncidentDetail(undefined);
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
      incidentDetail?.serverAllocation.id + "" !==
      router.query.serverAllocationId
    ) {
      setPermission(false);
    } else {
      setPermission(true);
    }
  };

  const resolveIncident = async (data: string) => {
    await incidentService
      .resolveIncident(
        session?.user.access_token!,
        incidentDetail?.id + "",
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

  useEffect(() => {
    if (router.query.serverAllocationId && session) {
      getData();
    }
  }, [session]);

  useEffect(() => {
    if (router.query.incidentId && session) {
      handleBreadCumb();
      rUAppointmentParamGet.Id = parseInt(router.query.incidentId!.toString());
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
  }, [incidentDetail]);

  if (incidentDetail === undefined) {
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
                <Button
                  type="primary"
                  className="mb-2"
                  // icon={<CaretLeftOutlined />}
                  onClick={() => setOpenModalResolve(true)}
                >
                  Resolve Incident
                </Button>
              </div>
            )}
            <ModalResolve
              open={openModalResolve}
              onClose={() => setOpenModalResolve(false)}
              onSubmit={(value) => {
                resolveIncident(value);
              }}
            />

            {areInArray(
              session?.user.roles!,
              ROLE_SALES,
              ROLE_TECH,
              ROLE_CUSTOMER
            ) &&
              permission && (
                <>
                  <div className="md:flex">
                    <ServerDetail
                      serverAllocationDetail={serverAllocationDetail!}
                      hardware={hardware!}
                    ></ServerDetail>
                    <IncidentDetailInfo incidentDetail={incidentDetail!} />
                  </div>

                  <AppointmentTable
                    typeGet="ByIncidentId"
                    urlOncell=""
                    onEdit={(record) => {}}
                    onDelete={async (record) => {}}
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
                </>
              )}
          </>
        }
      />
    );
};

export default IncidentDetail;
