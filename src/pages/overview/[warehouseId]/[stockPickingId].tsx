"use client";
import { handleBreadCumb } from "@utils/helpers";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import useDispatch from "@hooks/use-dispatch";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useState } from "react";
import productTemplateServices from "@services/productTemplate";
import {
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
  Row,
  Select,
} from "antd";
import BreadcrumbComponent from "@components/breadcrumb/BreadcrumbComponent";
import FlexButtons from "@components/button/FlexButtons";
import { OptionType } from "@models/base";
import { useRouter } from "next/router";
import stockPickingServices from "@services/stockPicking";
import {
  StockPickingCreate,
  StockPickingInfo,
  StockPickingReceipt,
  StockPickingReceiptUpdate,
} from "@models/stockPicking";
import stockWarehouseServices from "@services/stockWarehouse";
import stockLocationServices from "@services/stockLocation";
import stockLPickingServices from "@services/stockPicking";
import { StockWarehouseInfo } from "@models/stockWarehouse";
import moment from "moment";
import { dateAdvFormat } from "@utils/constants";
import dayjs from "dayjs";

const { Option } = Select;
const { TextArea } = Input;

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});

interface Props {
  warehouseId: string;
  stockPickingId: string;
  accessToken: string;
  itemBrs: ItemType[];
}

interface FormStockPicking {
  partnerId?: string;
  pickingTypeId?: string;
  locationDestId?: string;
  name: string;
  note?: string;
}

const ProductInfoPage: React.FC<Props> = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { warehouseId, stockPickingId, accessToken, itemBrs } = props;
  const [formStockPicking] = Form.useForm<FormStockPicking>();
  const [stockPickingInfo, setStockPickingInfo] = useState<StockPickingInfo>();
  const [stockWarehouseInfo, setStockWarehouseInfo] =
    useState<StockWarehouseInfo>();
  const [scheduledDate, setScheduledDate] = useState<string>();
  const [dateDeadline, setDateDeadline] = useState<string>();
  const [isChanged, setIsChanged] = useState(false);
  const [internalLocationOptions, setInternalLocationOptions] = useState<
    OptionType[]
  >([]);

  const handleScheduledDateChange = (date) => {
    date
      ? setScheduledDate(dayjs(date).format(dateAdvFormat))
      : setScheduledDate(undefined);
    setIsChanged(true);
  };

  const handledateDeadlineChange = (date) => {
    date
      ? setDateDeadline(dayjs(date).format(dateAdvFormat))
      : setDateDeadline(undefined);
    setIsChanged(true);
  };

  const onSave = async () => {
    await formStockPicking.validateFields();
    if (stockPickingId === "new") {
      const data = formStockPicking.getFieldsValue() as StockPickingReceipt;
      data.scheduledDate = scheduledDate;
      data.dateDeadline = dateDeadline;
      await stockPickingServices
        .createStockPickingReceipt(accessToken, data)
        .then((res) => {
          router.push(`/overview/${warehouseId}/${res?.id}`).then(() => {
            router.reload();
          });
        })
        .catch((error) => {
          message.error(error?.response?.data);
        });
    } else {
      await stockLPickingServices
        .updateStockPickingReceipt(accessToken, {
          id: stockPickingId,
          note: formStockPicking.getFieldsValue().note,
          locationDestId: formStockPicking.getFieldsValue().locationDestId,
          dateDeadline: dateDeadline,
          scheduledDate: scheduledDate,
        } as StockPickingReceiptUpdate)
        .then(() => {
          message.success("The stock picking has been updated!");
          fetchStockPickingInfoData();
        })
        .catch((error) => {
          message.error(error?.response?.data);
        });
    }
  };
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

  const fetchStockPickingInfoData = async () => {
    if (stockPickingId !== "new") {
      await stockLPickingServices
        .getStockPickingInfo(accessToken, stockPickingId)
        .then((res) => {
          setStockPickingInfo({ ...res });
          formStockPicking.setFieldsValue({
            partnerId: res.partnerId,
            pickingTypeId: res.pickingTypeId,
            locationDestId: res.locationDestId,
            name: res.name,
            note: res.note,
          });
          setDateDeadline(res.dateDeadline);
          setScheduledDate(res.scheduledDate);
        })
        .catch((error) => {
          message.error(error?.response?.data);
        });
    }
    setIsChanged(false);
  };

  const fetchInternalLocations = async () => {
    await stockLocationServices
      .getInternalLocations(accessToken)
      .then((res) => {
        const options: OptionType[] = res.map((item) => ({
          value: item.id,
          label: item.completeName,
        })) as any;
        setInternalLocationOptions(options);
      })
      .catch((error) => {
        message.error(error?.response?.data);
      });
  };

  useEffect(() => {
    fetchStockWarehouseInfoData();
    fetchInternalLocations();
    fetchStockPickingInfoData();
  }, []);

  const dateFormat = "YYYY-MM-DD";

  return (
    <AntdLayoutNoSSR
      content={
        <>
          <BreadcrumbComponent
            itemBreadcrumbs={itemBrs}
            accessToken={accessToken}
          />
          <Divider orientation="left" orientationMargin="0">
            {`Receipt - ${
              stockPickingInfo?.name ? `(${stockPickingInfo?.name})` : ""
            }`}
          </Divider>
          <FlexButtons
            isChanged={isChanged}
            onSave={onSave}
            onReload={fetchStockPickingInfoData}
          />
          <Card style={{ borderWidth: "5px" }}>
            <Form
              wrapperCol={{ span: 12 }}
              labelCol={{ span: 6 }}
              labelAlign="left"
              form={formStockPicking}
              onValuesChange={(value: StockPickingReceipt) => {
                setIsChanged(true);
              }}
            >
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    labelCol={{ xl: 8 }}
                    name="partnerId"
                    label={
                      <p
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                      >
                        Receive From
                      </p>
                    }
                  >
                    <Select style={{ width: "100%" }} variant="filled"></Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    labelCol={{ xl: 8 }}
                    label={
                      <p
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                      >
                        Scheduled Date
                      </p>
                    }
                  >
                    <DatePicker
                      allowClear={false}
                      showTime
                      value={scheduledDate ? dayjs(scheduledDate) : undefined}
                      format={dateAdvFormat}
                      onChange={(date) => {
                        handleScheduledDateChange(date);
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    labelCol={{ xl: 8 }}
                    name="pickingTypeId"
                    rules={[
                      {
                        required: true,
                        message: "Please input the Operation Type!",
                      },
                    ]}
                    label={
                      <p
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                      >
                        Operation Type
                      </p>
                    }
                  >
                    <Select
                      style={{ width: "100%" }}
                      variant="filled"
                      disabled={Boolean(stockPickingId !== "new")}
                    >
                      {stockWarehouseInfo?.stockPickingTypes.map((option) => (
                        <Option key={option.id} value={option.id}>
                          {option.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    labelCol={{ xl: 8 }}
                    label={
                      <p
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                      >
                        Effective Date
                      </p>
                    }
                  >
                    <DatePicker allowClear={false} showTime disabled placeholder="Effective Date" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    labelCol={{ xl: 8 }}
                    name="locationDestId"
                    rules={[
                      {
                        required: true,
                        message: "Please input the Destination Location!",
                      },
                    ]}
                    label={
                      <p
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                      >
                        Destination Location
                      </p>
                    }
                  >
                    <Select style={{ width: "100%" }} variant="filled">
                      {internalLocationOptions.map((option) => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    labelCol={{ xl: 8 }}
                    label={
                      <p
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                      >
                        Deadline
                      </p>
                    }
                  >
                    <DatePicker
                      allowClear={false}
                      showTime
                      value={dateDeadline ? dayjs(dateDeadline) : undefined}
                      format={dateAdvFormat}
                      onChange={(date) => {
                        handledateDeadlineChange(date);
                      }}
                    />
                  </Form.Item>
                </Col>{" "}
              </Row>
              <Divider orientation="left">Note</Divider>
              <Row gutter={24}>
                <Col span={24}>
                  <Form.Item
                    layout="vertical"
                    name="note"
                    wrapperCol={{ span: 24 }}
                  >
                    <TextArea placeholder="Description" />
                  </Form.Item>
                </Col>
              </Row>
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
  const stockPickingId = context.query.stockPickingId!;
  const warehouseId = context.query.warehouseId!;
  const accessToken = session?.user?.access_token!;
  const itemBrs = handleBreadCumb(context.resolvedUrl);
  return {
    props: {
      stockPickingId: stockPickingId.toString(),
      warehouseId: warehouseId.toString(),
      accessToken: accessToken?.toString(),
      itemBrs: itemBrs,
    },
  };
};
export default ProductInfoPage;
