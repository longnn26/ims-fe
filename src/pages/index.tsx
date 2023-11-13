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
  ServerAllocation,
  ServerAllocationData,
} from "@models/serverAllocation";
import { Button, Pagination, message } from "antd";
import ServerAllocationTable from "@components/serverAllocation/ServerAllocationTable";
import ModalCreate from "@components/serverAllocation/ModalCreate";
import serverAllocationService from "@services/serverAllocation";
const AntdLayoutNoSSR = dynamic(() => import("../../layout/AntdLayout"), {
  ssr: false,
});

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
  const [serverAllocationEdit, setServerAllocationEdit] = useState<
    ServerAllocation | undefined
  >(undefined);
  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);

  const getData = async () => {
    dispatch(
      getServerAllocationData({
        token: session?.user.access_token!,
        paramGet: { ...paramGet },
      })
    ).then(({ payload }) => {
      var res = payload as ServerAllocationData;
      if (res.totalPage < paramGet.PageIndex && res.totalPage != 0) {
        setParamGet({ ...paramGet, PageIndex: res.totalPage });
      }
    });
  };

  const createData = async (data: SACreateModel) => {
    await serverAllocationService
      .createServerAllocation(session?.user.access_token!, data)
      .then((res) => {
        message.success("Create successfull!");
        getData();
      })
      .catch((errors) => {
        message.error(errors.response.data);
      })
      .finally(() => {
        setOpenModalCreate(false);
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
              setServerAllocationEdit(record);
            }}
            onDelete={async (record) => {
              // deleteLanguage(record);
            }}
          />

          <ModalCreate
            open={openModalCreate}
            onClose={() => setOpenModalCreate(false)}
            onSubmit={(data: SACreateModel) => {
              createData(data);
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
