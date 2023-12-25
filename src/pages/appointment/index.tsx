"use client";
import ModalCreate from "@components/appointment/ModalCreate";
import ModalUpdate from "@components/appointment/ModalUpdate";
import AppointmentTable from "@components/server/requestUpgrade/AppointmentTable";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import { Appointment, AppointmentCreateModel, AppointmentUpdateModel } from "@models/appointment";
import { ParamGet } from "@models/base";
import { RUAppointmentParamGet } from "@models/requestUpgrade";
import appointmentService from "@services/appointment";
import { getListAppointment } from "@slices/appointment";
import { ROLE_CUSTOMER, ROLE_SALES, ROLE_TECH } from "@utils/constants";
import { areInArray, parseJwt } from "@utils/helpers";
import { Pagination, Button, message, Alert, Modal } from "antd";
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
  const [appointmentUpdate, setAppointmentUpdate] = useState<Appointment | undefined>(undefined);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [itemBreadcrumbs, setItemBreadcrumbs] = useState<ItemType[]>([]);
  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
  const [rUAppointmentParamGet, setRUAppointmentParamGet] =
    useState<RUAppointmentParamGet>({
      PageIndex: 1,
      PageSize: 10,
      CustomerId: "",
    } as unknown as RUAppointmentParamGet);

  const getData = async () => {
    if (session?.user.roles.includes("Customer")) {
      rUAppointmentParamGet.CustomerId = parseJwt(session.user.access_token).UserId;
    }
    await dispatch(
      getListAppointment({
        token: session?.user.access_token!,
        paramGet: { ...rUAppointmentParamGet },
      })
    );
  };

  const createData = async (data: AppointmentCreateModel) => {
    await appointmentService
      .create(session?.user.access_token!, data)
      .then((res) => {
        message.success("Create successfully!");
        getData();
      })
      .catch((errors) => {
        message.error(errors.response.data);
      })
      .finally(() => {
        setOpenModalCreate(false);
      });
  };

  const updateData = async (data: AppointmentUpdateModel) => {
    await appointmentService
      .update(session?.user.access_token!, data)
      .then((res) => {
        message.success("Update successfully!");
        getData();
      })
      .catch((errors) => {
        message.error(errors.response.data);
      })
      .finally(() => {
        setAppointmentUpdate(undefined);
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
          .deleteAppointment(
            session?.user.access_token!,
            appointment.id
          )
          .then(() => {
            getData();
            message.success(`Delete successfully!`);
          })
          .catch((errors) => {
            message.error(errors.response.data ?? "Delete failed");
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
  }, [session, rUAppointmentParamGet]);

  return (
    <AntdLayoutNoSSR
      content={
        <>
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
                onSubmit={(data: AppointmentCreateModel) => {
                  createData(data);
                }}
              />
            </>
          )}
          {areInArray(session?.user.roles!, ROLE_TECH, ROLE_SALES, ROLE_CUSTOMER) && (
            <>
              <ModalUpdate
                appointment={appointmentUpdate!}
                onClose={() => setAppointmentUpdate(undefined)}
                onSubmit={(data: AppointmentUpdateModel) => {
                  updateData(data);
                }}
              />
              <AppointmentTable
                typeGet="All"
                urlOncell=""
                onEdit={(record) => { setAppointmentUpdate(record); }}
                onDelete={async (record) => { deleteAppointment(record); }}
              />
              {listAppointmentData?.totalPage > 0 && (
                <Pagination
                  className="text-end m-4"
                  current={rUAppointmentParamGet?.PageIndex}
                  pageSize={listAppointmentData?.pageSize ?? 10}
                  total={listAppointmentData?.totalSize}
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

export default Appoinment;
