"use client";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { handleBreadCumb } from "@utils/helpers";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import BreadcrumbComponent from "@components/breadcrumb/BreadcrumbComponent";
import { Card, Form, Input, message, Select, Space } from "antd";
import {
  StockWarehouseInfo,
  StockWarehouseUpdate,
} from "@models/stockWarehouse";
import FlexButtons from "@components/button/FlexButtons";
import { OptionType } from "@models/base";
import stockWarehouseServices from "@services/stockWarehouse";
const { Option } = Select;

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});
interface Props {
  warehouseId: string;
  accessToken: string;
  itemBrs: ItemType[];
}
const WarehouseInfoPage: React.FC<Props> = (props) => {
  const router = useRouter();
  const { warehouseId, accessToken, itemBrs } = props;
  const [options, setOptions] = useState<OptionType[]>([]);
  const [stockWarehouseInfo, setStockWarehouseInfo] =
    useState<StockWarehouseInfo>();
  const [stockWarehouseName, setStockWarehouseName] = useState<string>();

  const [isChanged, setIsChanged] = useState(false);

  const handleInputNameChange = (event) => {
    setStockWarehouseName(event.target.value);
  };

  const fetchStockWarehouseInfoData = useCallback(async () => {
    await stockWarehouseServices
      .getStockWarehouseInfo(accessToken, warehouseId)
      .then((res) => {
        setStockWarehouseInfo({ ...res });
        setStockWarehouseName(res.name);
      })
      .catch((error) => {
        message.error(error?.response?.data);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchStockWarehouseInfoData();
  }, [fetchStockWarehouseInfoData]);

  return (
    <AntdLayoutNoSSR
      content={
        <>
          <BreadcrumbComponent itemBreadcrumbs={itemBrs} />
          <FlexButtons
            isChanged={isChanged}
            onSave={() => {}}
            onReload={fetchStockWarehouseInfoData}
          />
          <Card style={{ borderWidth: "5px" }}>
            <Form wrapperCol={{ span: 12 }} layout="vertical">
              <Form.Item
                label={
                  <p style={{ fontSize: "14px", fontWeight: "500" }}>
                    Category
                  </p>
                }
              >
                <Input
                  placeholder="Category"
                  variant="filled"
                  value={stockWarehouseName}
                  onChange={handleInputNameChange}
                />
              </Form.Item>
            </Form>
          </Card>
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

export default WarehouseInfoPage;
