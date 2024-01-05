"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import React from "react";
import { ParamGet } from "@models/base";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import { getServerAllocationData } from "@slices/serverAllocation";
import {
  SACreateModel,
  SAUpdateModel,
  ServerAllocation,
  ServerAllocationData,
} from "@models/serverAllocation";
import { Button, Pagination, message, Modal, Alert } from "antd";
import ServerAllocationTable from "@components/server/ServerAllocationTable";
import ModalCreate from "@components/server/ModalCreate";
import serverAllocationService from "@services/serverAllocation";
import ModalUpdate from "@components/server/ModalUpdate";
import { useRouter } from "next/router";
const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});
const { confirm } = Modal;

const Customer: React.FC = () => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const { serverAllocationData } = useSelector(
    (state) => state.serverAllocation
  );

  const [paramGet, setParamGet] = useState<ParamGet>({
    PageIndex: 1,
    PageSize: 10,
  } as ParamGet);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [serverAllocationUpdate, setServerAllocationUpdate] = useState<ServerAllocation | undefined>(undefined);
  const [serverAllocationAlert, setServerAllocationAlert] = useState<ServerAllocation | undefined>(undefined);
  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
  const router = useRouter();

  const getData = async () => {
    dispatch(
      getServerAllocationData({
        token: session?.user.access_token!,
        param: { ...paramGet },
      })
    ).then(({ payload }) => {
      var res = payload as ServerAllocationData;
      if (res.totalPage < paramGet.PageIndex && res.totalPage != 0) {
        setParamGet({ ...paramGet, PageIndex: res.totalPage });
      }
    });
  };

  // const createData = async (data: SACreateModel) => {
  //   await serverAllocationService
  //     .createServerAllocation(session?.user.access_token!, data)
  //     .then((res) => {
  //       message.success("Create successfully!", 1.5);
  //       getData();
  //     })
  //     .catch((errors) => {
  //       message.error(errors.response.data);
  //     })
  //     .finally(() => {
  //       setOpenModalCreate(false);
  //     });
  // };

  const updateData = async (data: SAUpdateModel) => {
    await serverAllocationService
      .updateServerAllocation(session?.user.access_token!, data)
      .then((res) => {
        message.success("Update successfully!", 1.5);
        getData();
      })
      .catch((errors) => {
        message.error(errors.response.data, 1.5);
      })
      .finally(() => {
        setServerAllocationUpdate(undefined);
      });
  };

  const deleteServerAllocation = (serverAllocation: ServerAllocation) => {
    confirm({
      title: "Delete",
      content: (
        <Alert
          message={`Do you want to delete with Id ${serverAllocation.id}?`}
          // description={`${serverAllocation.id}`}
          type="warning"
        />
      ),
      async onOk() {
        setLoadingSubmit(true);
        await serverAllocationService
          .deleteServerAllocation(
            session?.user.access_token!,
            serverAllocation.id
          )
          .then(() => {
            getData();
            message.success(`Delete server allocation successfully`, 1.5);
          })
          .catch((errors) => {
            message.error(
              errors.response.data ?? "Delete server allocation failed", 1.5
            );
            setLoadingSubmit(false);
          });
      },
      onCancel() {},
    });
  };

  useEffect(() => {
    session && getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, paramGet, openModalCreate]);

  return (
    <AntdLayoutNoSSR
      content={
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
            {/* <SearchComponent
              placeholder="Search Name, Description..."
              setSearchValue={(value) =>
                setParamGet({ ...paramGet, SearchValue: value })
              }
            /> */}
          </div>
          <ServerAllocationTable
            onEdit={(record) => {
              setServerAllocationUpdate(record);
            }}
            onDelete={async (record) => {
              // deleteServerAllocation(record);
            }}
            onAlert={(record) => {
              setServerAllocationAlert(record);
            }}
          />

          <ModalCreate
            open={openModalCreate}
            onClose={() => setOpenModalCreate(false)}
            onSubmit={() => {
              setOpenModalCreate(false);
              getData();
            }}
          />
          <ModalUpdate
            serverAllocation={serverAllocationUpdate!}
            onClose={() => setServerAllocationUpdate(undefined)}
            onSubmit={(data: SAUpdateModel) => {
              updateData(data);
            }}
          />
          {serverAllocationData.totalPage > 0 && (
            <Pagination
              className="text-end m-4"
              current={paramGet.PageIndex}
              pageSize={serverAllocationData.pageSize ?? 10}
              total={serverAllocationData.totalSize}
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
      }
    />
  );
};

export default Customer;
