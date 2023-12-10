"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import React from "react";
import { ParamGet } from "@models/base";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import { getRequestHostData } from "@slices/requestHost";
import {
  RequestHost,
  RequestHostData,
  RequestHostUpdateModel,
} from "@models/requestHost";
import { Button, Pagination, message, Modal, Alert } from "antd";
import requestHostService from "@services/requestHost";
// import ModalUpdate from "@components/requestHost/ModalUpdate";
import RequestHostTable from "@components/server/requestHost/RequestHostTable";
const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});

const { confirm } = Modal;

const Customer: React.FC = () => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const { requestHostData } = useSelector((state) => state.requestHost);

  const [paramGet, setParamGet] = useState<ParamGet>({
    PageIndex: 1,
    PageSize: 7,
  } as ParamGet);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [customerUpdate, setCustomerUpdate] = useState<RequestHost | undefined>(
    undefined
  );
  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);

  const getData = async () => {
    dispatch(
      getRequestHostData({
        token: session?.user.access_token!,
        paramGet: { ...paramGet },
      })
    ).then(({ payload }) => {
      var res = payload as RequestHostData;
      if (res.totalPage < paramGet.PageIndex && res.totalPage != 0) {
        setParamGet({ ...paramGet, PageIndex: res.totalPage });
      }
    });
  };

  // const updateData = async (data: CustomerUpdateModel) => {
  //   await customerService
  //     .updateData(session?.user.access_token!, data)
  //     .then((res) => {
  //       message.success("Update successful!");
  //       getData();
  //     })
  //     .catch((errors) => {
  //       message.error(errors.message);
  //     })
  //     .finally(() => {
  //       setCustomerUpdate(undefined);
  //     });
  // };

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
          <RequestHostTable
            // onEdit={(record) => {
            //   setCustomerUpdate(record);
            // }}
          />
          {/* <ModalUpdate
            customer={customerUpdate!}
            onClose={() => setCustomerUpdate(undefined)}
            onSubmit={(data: CustomerUpdateModel) => {
              updateData(data);
            }}
          /> */}
          {requestHostData.totalPage > 0 && (
            <Pagination
              className="text-end m-4"
              current={paramGet.PageIndex}
              pageSize={requestHostData.pageSize ?? 10}
              total={requestHostData.totalSize}
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