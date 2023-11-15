"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import React from "react";
import { ParamGet } from "@models/base";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import { getAreaData } from "@slices/area";
import { AreaCreateModel, AreaUpdateModel, Area, AreaData } from "@models/area";
import {
  Button,
  Pagination,
  message,
  Modal,
  Alert,
  DescriptionsProps,
  Divider,
  Descriptions,
} from "antd";
import ModalCreate from "@components/area/ModalCreate";
import areaService from "@services/area";
import ModalUpdate from "@components/area/ModalUpdate";
import AreaTable from "@components/area/AreaTable";
import { useRouter } from "next/router";
import moment from "moment";
import { dateAdvFormat } from "@utils/constants";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import BreadcrumbComponent from "@components/BreadcrumbComponent";
const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});
var itemBreadcrumbs: ItemType[] = [];
const { confirm } = Modal;

const AreaDetail: React.FC = () => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const router = useRouter();
  const { customerData } = useSelector((state) => state.customer);

  const [paramGet, setParamGet] = useState<ParamGet>({
    PageIndex: 1,
    PageSize: 7,
  } as ParamGet);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [areaUpdate, setAreaUpdate] = useState<Area | undefined>(undefined);
  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
  const [itemDetails, setItemDetails] = useState<DescriptionsProps["items"]>(
    []
  );

  const getData = async () => {
    await areaService
      .getDataById(session?.user.access_token!, router.query.areaId + "")
      .then((res) => {
        var items = [] as DescriptionsProps["items"];
        items?.push({
          key: "1",
          label: "Id",
          children: res.id,
        });
        items?.push({
          key: "2",
          label: "Name",
          children: res.name,
        });
        items?.push({
          key: "3",
          label: "Row Count",
          children: res.rowCount,
        });
        items?.push({
          key: "4",
          label: "Column Count",
          children: res.columnCount,
        });
        items?.push({
          key: "6",
          label: "Date created",
          children: moment(res.dateCreated).format(dateAdvFormat),
        });
        items?.push({
          key: "7",
          label: "Date updated",
          children: moment(res.dateUpdated).format(dateAdvFormat),
        });
        setItemDetails(items);
      });
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
  };

  const createData = async (data: AreaCreateModel) => {
    await areaService
      .createData(session?.user.access_token!, data)
      .then((res) => {
        message.success("Create successful!");
        getData();
      })
      .catch((errors) => {
        message.error(errors.response.data);
      })
      .finally(() => {
        setOpenModalCreate(false);
      });
  };

  const updateData = async (data: AreaUpdateModel) => {
    await areaService
      .updateData(session?.user.access_token!, data)
      .then((res) => {
        message.success("Update successful!");
        getData();
      })
      .catch((errors) => {
        message.error(errors.message);
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
            message.success(`Delete area successful!`);
          })
          .catch((errors) => {
            message.error(errors.message ?? "Delete area failed");
            setLoadingSubmit(false);
          });
      },
      onCancel() {},
    });
  };

  const handleBreadCumb = () => {
    itemBreadcrumbs = [];
    var items = router.asPath.split("/").filter((_) => _ != "");
    var path = "";
    items.forEach((element) => {
      path += `/${element}`;
      itemBreadcrumbs.push({
        href: path,
        title: element,
      });
    });
  };

  useEffect(() => {
    if (router.query.areaId && session) {
      // paramGet.ServerAllocationId = parseInt(
      //   router.query.serverAllocationId!.toString()
      // );
      getData();
      handleBreadCumb();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, router.query.areaId]);
  return (
    <AntdLayoutNoSSR
      content={
        <>
          <div className="flex justify-between mb-4 p-2 bg-[#f8f9fa]/10 border border-gray-200 rounded-lg shadow-lg shadow-[#e7edf5]/50">
            <BreadcrumbComponent itemBreadcrumbs={itemBreadcrumbs} />
            {/* <Button
              type="primary"
              htmlType="submit"
              onClick={() => {
                setOpenModalCreate(true);
              }}
            >
              Create
            </Button> */}
            {/* <SearchComponent
              placeholder="Search Name, Description..."
              setSearchValue={(value) =>
                setParamGet({ ...paramGet, SearchValue: value })
              }
            /> */}
          </div>
          <Divider orientation="left" plain>
            <h3>Area Information</h3>
          </Divider>{" "}
          <Descriptions className="p-5" items={itemDetails} />
          {/* <AreaTable
            onEdit={(record) => {
              setAreaUpdate(record);
            }}
            onDelete={async (record) => {
              deleteComponent(record);
            }}
          /> */}
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
          {/* {customerData.totalPage > 0 && (
            <Pagination
              className="text-end m-4"
              current={paramGet.PageIndex}
              pageSize={customerData.pageSize ?? 10}
              total={customerData.totalSize}
              onChange={(page, pageSize) => {
                setParamGet({
                  ...paramGet,
                  PageIndex: page,
                  PageSize: pageSize,
                });
              }}
            />
          )} */}
        </>
      }
    />
  );
};

export default AreaDetail;
