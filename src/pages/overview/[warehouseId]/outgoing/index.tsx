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
  setSearchText,
  setPageIndex,
  setPageSize,
} from "@slices/stockPickingOutgoing";
import CreateButton from "@components/button/CreateButton";
import StockPickingIncomingTable from "@components/stockPicking/StockPickingIncomingTable";
import stockWarehouseServices from "@services/stockWarehouse";
import { StockWarehouseInfo } from "@models/stockWarehouse";
import { getStockPickingOutgoings } from "@slices/stockPickingOutgoing";
import StockPickingOutgoingTable from "@components/stockPicking/StockPickingOutgoingTable";
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
const StockPickingOutgoingPage: React.FC<Props> = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { warehouseId, accessToken, itemBrs } = props;
  const { data, pageIndex, pageSize, totalSize, searchText } = useSelector(
    (state) => state.stockPickingOutgoing
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

  const fetchStockPickingOutgoingData = useCallback(() => {
    dispatch(
      getStockPickingOutgoings({
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
    fetchStockPickingOutgoingData();
  }, [fetchStockPickingOutgoingData]);

  return (
    <AntdLayoutNoSSR
      content={
        <>
          <BreadcrumbComponent
            accessToken={accessToken}
            itemBreadcrumbs={itemBrs}
          />
          <Divider orientation="left" orientationMargin="0">
            {`${stockWarehouseInfo?.name} - Delivery Orders`}
          </Divider>
          <div className="flex justify-center">
            <Input
              prefix={<FaSearch />}
              className="input-search"
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
                router.push(`/overview/${warehouseId}/outgoing/new`)
              }
            />
          </div>
          <StockPickingOutgoingTable
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
export default StockPickingOutgoingPage;
