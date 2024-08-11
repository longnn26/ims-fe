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
import {
  StockLocationCreate,
  StockLocationInfo,
  StockLocationUpdate,
  StockLocationUpdateParent,
} from "@models/stockLocation";
const { Option } = Select;

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});
interface Props {
  locationId: string;
  accessToken: string;
  itemBrs: ItemType[];
}

interface FormStockLocation {
  name: string;
  usage: string;
}

const StockLocationInfoPage: React.FC<Props> = (props) => {
  const router = useRouter();
  const { locationId, accessToken, itemBrs } = props;
  const [options, setOptions] = useState<OptionType[]>([]);
  const [stockLocationInfo, setStockLocationInfo] =
    useState<StockLocationInfo>();
  const [formStockLocation] = Form.useForm<FormStockLocation>();
  const [parentStockLocationId, setParentStockLocationId] = useState<string>();
  const [isChanged, setIsChanged] = useState(false);

  const handleSelectParentChange = (value: string) => {
    setParentStockLocationId(value);
    setIsChanged(true);
  };

  const onSave = async () => {
    await formStockLocation.validateFields();
    if (locationId === "new") {
      const data = formStockLocation.getFieldsValue() as StockLocationCreate;
      await stockLocationServices
        .createStockLocation(accessToken, {
          ...data,
          locationId: parentStockLocationId!,
        })
        .then((res) => {
          router.push(`/locations/${res?.id}`).then(() => {
            router.reload();
          });
        })
        .catch((error) => {
          message.error(error?.response?.data);
        });
    } else {
      if (parentStockLocationId != stockLocationInfo?.parentLocation?.id) {
        await stockLocationServices
          .updateStockLocationParent(accessToken, {
            id: locationId,
            parentId: parentStockLocationId,
          } as StockLocationUpdateParent)
          .then(() => {})
          .catch((error) => {})
          .finally(() => {
            fetchStockLocationInfoData();
          });
      }
      await stockLocationServices
        .updateStockLocation(accessToken, {
          id: stockLocationInfo?.id,
          name: formStockLocation.getFieldsValue().name,
          usage: formStockLocation.getFieldsValue().usage,
        } as StockLocationUpdate)
        .then(() => {})
        .catch((error) => {
          message.error(error?.response?.data);
        })
        .finally(() => {
          fetchStockLocationInfoData();
        });
    }
  };

  const fetchStockLocationInfoData = useCallback(async () => {
    if (locationId !== "new") {
      await stockLocationServices
        .getStockLocationInfo(accessToken, locationId)
        .then((res) => {
          formStockLocation.setFieldsValue({
            usage: res.usage,
            name: res.name,
          });
          setParentStockLocationId(res?.parentLocation?.id);
          setStockLocationInfo({ ...res });
        })
        .catch((error) => {
          message.error(error?.response?.data);
        });
    } else {
      formStockLocation.resetFields();
    }
    setIsChanged(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchForSelectParent = async () => {
    if (locationId !== "new" && locationId) {
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
          // message.error(error?.response?.data);
        });
    } else {
      await stockLocationServices
        .getForSelectParent(accessToken)
        .then((res) => {
          const options: OptionType[] = res.map((item) => ({
            value: item.id,
            label: item.completeName,
          })) as any;
          setOptions(options);
        })
        .catch((error) => {
          // message.error(error?.response?.data);
        });
    }
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
            onSave={onSave}
            onReload={fetchStockLocationInfoData}
          />
          <Card style={{ borderWidth: "5px" }}>
            <Form
              wrapperCol={{ span: 12 }}
              layout="vertical"
              form={formStockLocation}
              onValuesChange={(value: any) => {
                setIsChanged(true);
              }}
            >
              <Form.Item
                name="name"
                label={
                  <p style={{ fontSize: "14px", fontWeight: "500" }}>
                    Location Name
                  </p>
                }
              >
                <Input
                  placeholder="Name"
                  variant="filled"
                  // value={stockLocationInfo?.name}
                  // readOnly={true}
                />
              </Form.Item>
              <Form.Item
                // name="locationId"
                label={
                  <p style={{ fontSize: "14px", fontWeight: "500" }}>
                    Parent Location
                  </p>
                }
              >
                <Select
                  showSearch
                  optionFilterProp="children"
                  dropdownMatchSelectWidth={false}
                  style={{ width: "100%" }}
                  variant="filled"
                  onChange={handleSelectParentChange}
                  value={parentStockLocationId}
                  // disabled
                >
                  {options.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="usage"
                label={
                  <p style={{ fontSize: "14px", fontWeight: "500" }}>
                    Location Type
                  </p>
                }
              >
                <Select
                  className="custom-select"
                  style={{ width: "100%" }}
                  variant="filled"
                  options={[
                    {
                      value: "View",
                      label: "View",
                    },
                    {
                      value: "Internal",
                      label: "Internal",
                    },
                    // {
                    //   value: "product",
                    //   label: "Storable Product",
                    // },
                  ]}
                  // value={productTemplateDetailedType}
                  // onChange={handleProductTemplateDetailedTypeChange}
                ></Select>
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
