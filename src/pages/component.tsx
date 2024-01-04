"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import React from "react";
import { ParamGet } from "@models/base";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import { getComponentData } from "@slices/component";
import {
  ComponentCreateModel,
  ComponentUpdateModel,
  ComponentObj,
  ComponentData,
} from "@models/component";
import { Button, Pagination, message, Modal, Alert } from "antd";
import ModalCreate from "@components/component/ModalCreate";
import componentService from "@services/component";
import ModalUpdate from "@components/component/ModalUpdate";
import ComponentTable from "@components/component/ComponentTable";
import { areInArray } from "@utils/helpers";
import { ROLE_TECH } from "@utils/constants";
const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});

const { confirm } = Modal;

const Customer: React.FC = () => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const { componentData } = useSelector((state) => state.component);

  const [paramGet, setParamGet] = useState<ParamGet>({
    PageIndex: 1,
    PageSize: 7,
  } as ParamGet);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [componentUpdate, setComponentUpdate] = useState<
    ComponentObj | undefined
  >(undefined);
  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);

  const getData = async () => {
    dispatch(
      getComponentData({
        token: session?.user.access_token!,
        paramGet: { ...paramGet },
      })
    ).then(({ payload }) => {
      var res = payload as ComponentData;
      if (res.totalPage < paramGet.PageIndex && res.totalPage != 0) {
        setParamGet({ ...paramGet, PageIndex: res.totalPage });
      }
    });
  };

  const createData = async (data: ComponentCreateModel) => {
    await componentService
      .createComponent(session?.user.access_token!, data)
      .then((res) => {
        message.success("Create successfully!", 1.5);
        getData();
      })
      .catch((errors) => {
        message.error(errors.response.data, 1.5);
      })
      .finally(() => {
        setOpenModalCreate(false);
      });
  };

  const updateData = async (data: ComponentUpdateModel) => {
    await componentService
      .updateComponent(session?.user.access_token!, data)
      .then((res) => {
        message.success("Update successfully!", 1.5);
        getData();
      })
      .catch((errors) => {
        message.error(errors.response.data, 1.5);
      })
      .finally(() => {
        setComponentUpdate(undefined);
      });
  };

  const deleteComponent = (serverAllocation: ComponentObj) => {
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
        await componentService
          .deleteComponent(session?.user.access_token!, serverAllocation.id)
          .then(() => {
            getData();
            message.success(`Delete component successfully!`, 1.5);
          })
          .catch((errors) => {
            message.error(errors.response.data ?? "Delete component failed", 1.5);
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
                {/* <SearchComponent
              placeholder="Search Name, Description..."
              setSearchValue={(value) =>
                setParamGet({ ...paramGet, SearchValue: value })
              }
            /> */}
              </div>
              <ComponentTable
                onEdit={(record) => {
                  setComponentUpdate(record);
                }}
                onDelete={async (record) => {
                  deleteComponent(record);
                }}
              />

              <ModalCreate
                open={openModalCreate}
                onClose={() => setOpenModalCreate(false)}
                onSubmit={(data: ComponentCreateModel) => {
                  createData(data);
                }}
              />
              <ModalUpdate
                component={componentUpdate!}
                onClose={() => setComponentUpdate(undefined)}
                onSubmit={(data: ComponentUpdateModel) => {
                  updateData(data);
                }}
              />
              {componentData.totalPage > 0 && (
                <Pagination
                  className="text-end m-4"
                  current={paramGet.PageIndex}
                  pageSize={componentData.pageSize ?? 10}
                  total={componentData.totalSize}
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

export default Customer;
