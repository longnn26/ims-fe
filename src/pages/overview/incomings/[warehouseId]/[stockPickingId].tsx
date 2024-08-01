"use client";
import { handleBreadCumb } from "@utils/helpers";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useState } from "react";
import productTemplateServices from "@services/productTemplate";
import productCategoryServices from "@services/productCategory";
import {
  ProductTemplateCreate,
  ProductTemplateInfo,
  ProductTemplateUpdate,
} from "@models/productTemplate";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Flex,
  Form,
  Input,
  message,
  Modal,
  Pagination,
  Row,
  Select,
  Tabs,
  Tag,
} from "antd";
import BreadcrumbComponent from "@components/breadcrumb/BreadcrumbComponent";
import FlexButtons from "@components/button/FlexButtons";
import { OptionType } from "@models/base";
import uomUomServices from "@services/uomUom";
import { useRouter } from "next/router";
import {
  getProductTemplateAttributeLines,
  resetData,
  setPageIndex,
} from "@slices/productTemplateAttributeLine";
import ProductTemplateAttributeLineTable from "@components/product/ProductTemplateAttributeLineTable";
import productTemplateAttributeLineServices from "@services/productTemplateAttributeLine";
import productAttributeServices from "@services/productAttribute";
import {
  ProductTemplateAttributeLineCreate,
  ProductTemplateAttributeLineInfo,
} from "@models/productTemplateAttributeLine";
import { PlusOutlined } from "@ant-design/icons";
import { PiTreeStructureFill, PiX } from "react-icons/pi";
import { FaBoxes } from "react-icons/fa";
import { StockPickingCreate, StockPickingInfo } from "@models/stockPicking";
import stockWarehouseServices from "@services/stockWarehouse";
import stockLocationServices from "@services/stockLocation";
import { StockWarehouseInfo } from "@models/stockWarehouse";

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

const ProductInfoPage: React.FC<Props> = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { warehouseId, stockPickingId, accessToken, itemBrs } = props;
  const [formStockPicking] = Form.useForm<StockPickingCreate>();
  const [stockPickingInfo, setStockPickingInfo] = useState<StockPickingInfo>();
  const [stockWarehouseInfo, setStockWarehouseInfo] =
    useState<StockWarehouseInfo>();
  const [internalLocationOptions, setInternalLocationOptions] = useState<
    OptionType[]
  >([]);
  const [isChanged, setIsChanged] = useState(false);

  const onSave = async () => {
    await formStockPicking.validateFields();
    if (stockPickingId === "new") {
      const data = {} as ProductTemplateCreate;
      console.log(formStockPicking.getFieldsValue());
    } else {
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
  }, []);
  return (
    <AntdLayoutNoSSR
      content={
        <>
          <BreadcrumbComponent itemBreadcrumbs={itemBrs} />
          <Divider orientation="left" orientationMargin="0">
            {`${stockWarehouseInfo?.name} - Receipts`}
          </Divider>
          <FlexButtons
            isChanged={isChanged}
            onSave={onSave}
            onReload={fetchStockWarehouseInfoData}
          />
          <Card style={{ borderWidth: "5px" }}>
            <Form
              wrapperCol={{ span: 12 }}
              labelCol={{ span: 6 }}
              labelAlign="left"
              form={formStockPicking}
              onValuesChange={(value: StockPickingCreate) => {
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
                    name="scheduledDate"
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
                    <DatePicker showTime />
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
                        message: "Please input the product Operation Type!",
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
                      // onChange={handleProductTemplateCategoryChange}
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
                  ></Form.Item>
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
                        message: "Please input the product Operation Type!",
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
                    name="name"
                    labelCol={{ xl: 8 }}
                    label={
                      <p
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                      >
                        Source Document
                      </p>
                    }
                  ></Form.Item>
                </Col>
              </Row>
              <Divider orientation="left">Note</Divider>
              <Row gutter={24}>
                <Col span={24}>
                  <Form.Item
                    layout="vertical"
                    name="note"
                    wrapperCol={{ span: 24 }}
                  >
                    <TextArea
                      placeholder="Description"
                      // onChange={handletProductTemplateDescriptionChange}
                    />
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
