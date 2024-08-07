"use client";
import { handleBreadCumb } from "@utils/helpers";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import BreadcrumbComponent from "@components/breadcrumb/BreadcrumbComponent";
import { Divider, Input, message, Pagination, Select } from "antd";
import stockPickingIncoming, {
  getStockPickingIncomings,
  setPageIndex,
  setSearchText,
  setPageSize,
} from "@slices/stockPickingIncoming";
import CreateButton from "@components/button/CreateButton";
import StockPickingIncomingTable from "@components/stockPicking/StockPickingIncomingTable";
import stockWarehouseServices from "@services/stockWarehouse";
import { StockWarehouseInfo } from "@models/stockWarehouse";
import { FaSearch } from "react-icons/fa";
const { Option } = Select;

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});

interface Props {
  warehouseId: string;
  accessToken: string;
  itemBrs: ItemType[];
}
const StockPickingIncomingPage: React.FC<Props> = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { warehouseId, accessToken, itemBrs } = props;
  const { data, pageIndex, pageSize, totalSize, searchText } = useSelector(
    (state) => state.stockPickingIncoming
  );
  const [stockWarehouseInfo, setStockWarehouseInfo] =
    useState<StockWarehouseInfo>();

  const fetchStockWarehouseInfoData = async () => {
    await stockWarehouseServices
      .getStockWarehouseInfo(accessToken, warehouseId)
      .then((res) => {
        setStockWarehouseInfo({ ...res });
      })
      .catch((error) => {
        message.error(error?.response?.data);
      });
  };

  const fetchStockPickingIncomingData = useCallback(() => {
    dispatch(
      getStockPickingIncomings({
        token: accessToken,
        warehouseId: warehouseId,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize, searchText]);

  useEffect(() => {
    fetchStockWarehouseInfoData();
  }, []);

  useEffect(() => {
    fetchStockPickingIncomingData();
  }, [fetchStockPickingIncomingData]);

  return (
    <AntdLayoutNoSSR
      content={
        <>
          <BreadcrumbComponent
            accessToken={accessToken}
            itemBreadcrumbs={itemBrs}
          />
          <Divider orientation="left" orientationMargin="0">
            {`${stockWarehouseInfo?.name} - Receipts`}
          </Divider>
          <div className="flex justify-center">
            <Input
              className="input-search"
              prefix={<FaSearch />}
              placeholder="Search Reference"
              defaultValue={searchText}
              onPressEnter={(event) => {
                dispatch(setSearchText(event.target["value"]));
              }}
            />
          </div>
          <div className="mt-3 mb-3">
            <CreateButton
              onSave={() =>
                router.push(`/overview/${warehouseId}/incoming/new`)
              }
            />
          </div>
          <StockPickingIncomingTable
            warehouseId={warehouseId}
            accessToken={accessToken}
          />
          {data?.length > 0 && (
            <Pagination
              className="text-end m-4"
              current={pageIndex}
              pageSize={pageSize}
              total={totalSize}
              showSizeChanger
              onShowSizeChange={(current, pageSize) => {
                dispatch(setPageSize(pageSize));
              }}
              onChange={(page) => {
                dispatch(setPageIndex(page));
              }}
            />
          )}
        </>
      }
    />
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const session = await getSession(context);
  const warehouseId = context.query.warehouseId!;
  const accessToken = session?.user?.access_token!;
  const itemBrs = handleBreadCumb(context.resolvedUrl);
  return {
    props: {
      warehouseId: warehouseId.toString(),
      accessToken: accessToken?.toString(),
      itemBrs: itemBrs,
    },
  };
};
export default StockPickingIncomingPage;
