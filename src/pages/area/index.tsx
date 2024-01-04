"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import React from "react";
import { ParamGet } from "@models/base";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import { getAllAreaData, getAreaData } from "@slices/area";
import { AreaCreateModel, AreaUpdateModel, Area, AreaData } from "@models/area";
import { Button, Pagination, message, Modal, Alert } from "antd";
import ModalCreate from "@components/area/ModalCreate";
import areaService from "@services/area";
import ModalUpdate from "@components/area/ModalUpdate";
import AreaTable from "@components/area/AreaTable";
import AreaCollap from "@components/area/AreaCollap";
import { ROLE_TECH } from "@utils/constants";
import { areInArray } from "@utils/helpers";
const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});

const { confirm } = Modal;

const Area: React.FC = () => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const { customerData } = useSelector((state) => state.customer);

  const [paramGet, setParamGet] = useState<ParamGet>({
    PageIndex: 1,
    PageSize: 7,
  } as ParamGet);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [areaUpdate, setAreaUpdate] = useState<Area | undefined>(undefined);
  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);

  const getData = async () => {
    // dispatch(
    //   getAreaData({
    //     token: session?.user.access_token!,
    //     paramGet: { ...paramGet },
    //   })
    // ).then(({ payload }) => {
    //   var res = payload as AreaData;
    //   if (res.totalPage < paramGet.PageIndex && res.totalPage != 0) {
    //     setParamGet({ ...paramGet, PageIndex: res.totalPage });
    //   }
    // });
    dispatch(
      getAllAreaData({
        token: session?.user.access_token!,
      })
    );
  };

  const createData = async (data: AreaCreateModel) => {
    await areaService
      .createData(session?.user.access_token!, data)
      .then((res) => {
        message.success("Create successfully!", 1.5);
        getData();
        setOpenModalCreate(false);
      })
      .catch((errors) => {
        message.error(errors.response.data, 1.5);
      });
  };

  const updateData = async (data: AreaUpdateModel) => {
    await areaService
      .updateData(session?.user.access_token!, data)
      .then((res) => {
        message.success("Update successfully!", 1.5);
        getData();
      })
      .catch((errors) => {
        message.error(errors.response.data, 1.5);
      })
      .finally(() => {
        setAreaUpdate(undefined);
      });
  };

  const deleteComponent = (area: Area) => {
    confirm({
      title: "Delete",
      content: (
        <Alert
          message={`Do you want to delete with Id ${area.id}?`}
          // description={`${serverAllocation.id}`}
          type="warning"
        />
      ),
      async onOk() {
        setLoadingSubmit(true);
        await areaService
          .deleteData(session?.user.access_token!, area.id)
          .then(() => {
            getData();
            message.success(`Delete area successfully`, 1.5);
          })
          .catch((errors) => {
            message.error(errors.response.data ?? "Delete area failed", 1.5);
            setLoadingSubmit(false);
          });
      },
      onCancel() {},
    });
  };

  useEffect(() => {
    session && getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, paramGet]);
  return (
    <AntdLayoutNoSSR
      content={
        <>
          {areInArray(session?.user.roles!, ROLE_TECH) && (
            <>
              <div className="flex justify-between mb-4 p-2 bg-[#f8f9fa]/10 border border-gray-200 rounded-lg shadow-lg shadow-[#e7edf5]/50">
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={() => {
                    setOpenModalCreate(true);
                  }}
                >
                  Create
                </Button>
              </div>
              <AreaCollap />

              <ModalCreate
                open={openModalCreate}
                onClose={() => setOpenModalCreate(false)}
                onSubmit={(data: AreaCreateModel) => {
                  createData(data);
                }}
              />
              <ModalUpdate
                area={areaUpdate!}
                onClose={() => setAreaUpdate(undefined)}
                onSubmit={(data: AreaUpdateModel) => {
                  updateData(data);
                }}
              />
            </>
          )}
        </>
      }
    />
  );
};

export default Area;
