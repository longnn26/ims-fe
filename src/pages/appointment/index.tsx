"use client";
import SearchComponent from "@components/SearchComponent";
import ModalCreate from "@components/appointment/ModalCreate";
import ModalUpdate from "@components/appointment/ModalUpdate";
import AppointmentTable from "@components/server/requestUpgrade/AppointmentTable";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import {
  Appointment,
  AppointmentCreateModel,
  AppointmentUpdateModel,
  ParamGetExtend,
} from "@models/appointment";
import { ParamGet } from "@models/base";
import { RUAppointmentParamGet } from "@models/requestUpgrade";
import appointmentService from "@services/appointment";
import { getListAppointment } from "@slices/appointment";
import {
  ROLE_CUSTOMER,
  ROLE_MANAGER,
  ROLE_SALES,
  ROLE_TECH,
} from "@utils/constants";
import { areInArray, parseJwt } from "@utils/helpers";
import {
  Pagination,
  Button,
  message,
  Alert,
  Modal,
  Spin,
  TabsProps,
  Tabs,
} from "antd";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});
const { confirm } = Modal;

const Appoinment: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: session } = useSession();
  const { listAppointmentData } = useSelector((state) => state.appointment);
  const [appointmentUpdate, setAppointmentUpdate] = useState<
    Appointment | undefined
  >(undefined);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [itemBreadcrumbs, setItemBreadcrumbs] = useState<ItemType[]>([]);
  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [paramGet, setParamGet] = useState<ParamGetExtend>({
    PageIndex: 1,
    PageSize: 10,
  } as unknown as ParamGetExtend);

  const getData = async () => {
    var customerId = "",
      userId = "";
    if (areInArray(session?.user.roles!, ROLE_SALES)) {
      userId = parseJwt(session?.user.access_token!).UserId;
    } else if (session?.user.roles.includes("Customer")) {
      customerId = parseJwt(session.user.access_token).UserId;
    }
    setLoading(true);
    await dispatch(
      getListAppointment({
        token: session?.user.access_token!,
        paramGet: {
          ...paramGet,
          CustomerId: customerId,
          Statuses: status,
          UserId: userId,
        },
      })
    ).finally(() => {
      setLoading(false);
    });
  };

  const deleteAppointment = (appointment: Appointment) => {
    confirm({
      title: "Delete",
      content: (
        <Alert
          message={`Do you want to delete with Id ${appointment.id}?`}
          // description={`${serverAllocation.id}`}
          type="warning"
        />
      ),
      async onOk() {
        setLoadingSubmit(true);
        await appointmentService
          .deleteAppointment(session?.user.access_token!, appointment.id)
          .then(() => {
            getData();
            message.success(`Delete successfully!`, 1.5);
          })
          .catch((errors) => {
            message.error(errors.response.data ?? "Delete failed", 1.5);
            setLoadingSubmit(false);
          });
      },
      onCancel() {},
    });
  };

  useEffect(() => {
    if (session) {
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  useEffect(() => {
    if (session) {
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openModalCreate]);

  useEffect(() => {
    session && getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    session && getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramGet]);

  const handleChange = (value) => {
    switch (value) {
      case "0":
        setParamGet({
          ...paramGet,
          PageIndex: 1,
        });
        setStatus(undefined);
        break;
      case "1":
        setParamGet({
          ...paramGet,
          PageIndex: 1,
        });
        setStatus("Waiting");
        break;
      case "2":
        setParamGet({
          ...paramGet,
          PageIndex: 1,
        });
        setStatus("Accepted");
        break;
      case "3":
        setParamGet({
          ...paramGet,
          PageIndex: 1,
        });
        setStatus("Denied");
        break;
      case "4":
        setParamGet({
          ...paramGet,
          PageIndex: 1,
        });
        setStatus("Success");
        break;
      case "5":
        setParamGet({
          ...paramGet,
          PageIndex: 1,
        });
        setStatus("Failed");
        break;
    }
  };

  const items: TabsProps["items"] = [
    {
      key: "0",
      label: "All",
    },
    {
      key: "1",
      label: "Waiting",
    },
    {
      key: "2",
      label: "Accepted",
    },
    {
      key: "3",
      label: "Denied",
    },
    {
      key: "4",
      label: "Success",
    },
    {
      key: "5",
      label: "Failed",
    },
  ];

  return (
    <AntdLayoutNoSSR
      content={
        <>
          <div className="flex justify-between mb-4 p-2 bg-[#f8f9fa]/10 border border-gray-200 rounded-lg shadow-lg shadow-[#e7edf5]/50">
            {areInArray(session?.user.roles!, ROLE_CUSTOMER) && (
              <>
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={() => {
                    setOpenModalCreate(true);
                  }}
                >
                  Create
                </Button>
                <ModalCreate
                  open={openModalCreate}
                  onClose={() => setOpenModalCreate(false)}
                  onSubmit={() => {
                    //Loading: thêm chỗ này
                    setOpenModalCreate(false);
                    getData();
                  }}
                />
              </>
            )}
            {!areInArray(session?.user.roles!, ROLE_CUSTOMER) && (
              <div className="flex-grow"></div>
            )}
            <SearchComponent
              placeholder="Search Name, Description..."
              setSearchValue={(value) =>
                setParamGet({ ...paramGet, SearchValue: value })
              }
            />
          </div>
          <Tabs
            className="m-5"
            defaultActiveKey="0"
            items={items}
            centered
            onTabClick={(value) => handleChange(value)}
          />
          {areInArray(
            session?.user.roles!,
            ROLE_TECH,
            ROLE_SALES,
            ROLE_CUSTOMER,
            ROLE_MANAGER
          ) && (
            <>
              {appointmentUpdate && (
                <ModalUpdate
                  appointment={appointmentUpdate!}
                  onClose={() => setAppointmentUpdate(undefined)}
                  onSubmit={() => {
                    setAppointmentUpdate(undefined);
                    getData();
                  }}
                />
              )}
              {loading === true ? (
                <>
                  <Spin size="large" tip="Loading data...">
                    <AppointmentTable
                      typeGet="All"
                      urlOncell=""
                      onEdit={(record) => {
                        setAppointmentUpdate(record);
                      }}
                      onDelete={async (record) => {
                        deleteAppointment(record);
                      }}
                    />
                  </Spin>
                </>
              ) : (
                <>
                  <AppointmentTable
                    typeGet="All"
                    urlOncell=""
                    onEdit={(record) => {
                      setAppointmentUpdate(record);
                    }}
                    onDelete={async (record) => {
                      deleteAppointment(record);
                    }}
                  />
                </>
              )}
              {listAppointmentData?.totalPage > 0 && (
                <Pagination
                  className="text-end m-4"
                  current={paramGet?.PageIndex}
                  pageSize={listAppointmentData?.pageSize ?? 10}
                  total={listAppointmentData?.totalSize}
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
          )}
        </>
      }
    />
  );
};

export default Appoinment;
