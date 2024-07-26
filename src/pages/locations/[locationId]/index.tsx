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
  ProductCategoryInfo,
  ProductCategoryUpdateInfo,
  ProductCategoryUpdateParent,
} from "@models/productCategory";
import FlexButtons from "@components/button/FlexButtons";
import { OptionType } from "@models/base";
import stockLocationServices from "@services/stockLocation";
import { StockLocationInfo } from "@models/stockLocation";
const { Option } = Select;

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});
interface Props {
  locationId: string;
  accessToken: string;
  itemBrs: ItemType[];
}
const StockLocationInfoPage: React.FC<Props> = (props) => {
  const router = useRouter();
  const { locationId, accessToken, itemBrs } = props;
  const [options, setOptions] = useState<OptionType[]>([]);
  const [stockLocationInfo, setStockLocationInfo] =
    useState<StockLocationInfo>();

  const [isChanged, setIsChanged] = useState(false);

  const fetchStockLocationInfoData = useCallback(async () => {
    await stockLocationServices
      .getStockLocationInfo(accessToken, locationId)
      .then((res) => {
        setStockLocationInfo({ ...res });
      })
      .catch((error) => {
        message.error(error?.response?.data);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchForSelectParent = async () => {
    await stockLocationServices
      .getForSelectParent(accessToken, locationId)
      .then((res) => {
        const options: OptionType[] = res.map((item) => ({
          value: item.id,
          label: item.completeName,
        })) as any;
        setOptions(options);
      })
      .catch((error) => {
        message.error(error?.response?.data);
      });
  };

  useEffect(() => {
    fetchForSelectParent();
  }, []);

  useEffect(() => {
    fetchStockLocationInfoData();
  }, [fetchStockLocationInfoData]);
  return (
    <AntdLayoutNoSSR
      content={
        <>
          <BreadcrumbComponent itemBreadcrumbs={itemBrs} />
          <FlexButtons
            isChanged={isChanged}
            onSave={() => {}}
            onReload={fetchStockLocationInfoData}
          />
          <Card style={{ borderWidth: "5px" }}>
            <Form wrapperCol={{ span: 12 }} layout="vertical">
              <Form.Item
                label={
                  <p style={{ fontSize: "14px", fontWeight: "500" }}>
                    Location Name
                  </p>
                }
              >
                <Input
                  placeholder="Category"
                  variant="filled"
                  value={stockLocationInfo?.name}
                  readOnly={true}
                />
              </Form.Item>
              <Form.Item
                label={
                  <p style={{ fontSize: "14px", fontWeight: "500" }}>
                    Parent Location
                  </p>
                }
              >
                <Select
                  style={{ width: "100%" }}
                  variant="filled"
                  value={stockLocationInfo?.parentLocation?.id}
                  disabled
                >
                  {options.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label={
                  <p style={{ fontSize: "14px", fontWeight: "500" }}>
                    Location Type
                  </p>
                }
              >
                <Input
                  placeholder="Category"
                  variant="filled"
                  value={stockLocationInfo?.usage}
                  readOnly={true}
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
  const locationId = context.query.locationId!;
  const accessToken = session?.user?.access_token!;
  const itemBrs = handleBreadCumb(context.resolvedUrl);
  return {
    props: {
      locationId: locationId.toString(),
      accessToken: accessToken?.toString(),
      itemBrs: itemBrs,
    },
  };
};

export default StockLocationInfoPage;
