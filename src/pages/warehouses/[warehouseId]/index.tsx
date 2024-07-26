"use client";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { handleBreadCumb } from "@utils/helpers";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import BreadcrumbComponent from "@components/breadcrumb/BreadcrumbComponent";
import {
  Card,
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  Tabs,
} from "antd";
import {
  StockWarehouseInfo,
  StockWarehouseUpdate,
} from "@models/stockWarehouse";
import FlexButtons from "@components/button/FlexButtons";
import { OptionType } from "@models/base";
import stockWarehouseServices from "@services/stockWarehouse";
import Link from "next/link";
const { Option } = Select;

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});
interface Props {
  warehouseId: string;
  accessToken: string;
  itemBrs: ItemType[];
}

interface FormGeneralInfo {
  name: string;
  code: string;
}
const WarehouseInfoPage: React.FC<Props> = (props) => {
  const router = useRouter();
  const { warehouseId, accessToken, itemBrs } = props;
  const [formGeneralInfo] = Form.useForm<FormGeneralInfo>();

  const [stockWarehouseInfo, setStockWarehouseInfo] =
    useState<StockWarehouseInfo>();

  const [isChanged, setIsChanged] = useState(false);

  const handleInputNameChange = (event) => {
    if (event.target.value === "") {
      formGeneralInfo.setFieldsValue({ name: undefined });
    } else {
      formGeneralInfo.setFieldsValue({ name: event.target.value });
    }
  };

  const handleInputCodeChange = (event) => {
    if (event.target.value === "") {
      formGeneralInfo.setFieldsValue({ code: undefined });
    } else {
      formGeneralInfo.setFieldsValue({ code: event.target.value });
    }
  };

  const onSave = async () => {
    await stockWarehouseServices
      .updateStockWarehouse(accessToken, {
        id: warehouseId,
        name: formGeneralInfo.getFieldsValue().name,
        code: formGeneralInfo.getFieldsValue().code,
      } as StockWarehouseUpdate)
      .then(() => {
        message.success("The product has been updated!");
        fetchStockWarehouseInfoData();
      })
      .catch((error) => {
        message.error(error?.response?.data);
      });
  };

  const fetchStockWarehouseInfoData = useCallback(async () => {
    await stockWarehouseServices
      .getStockWarehouseInfo(accessToken, warehouseId)
      .then((res) => {
        setStockWarehouseInfo({ ...res });
        formGeneralInfo.setFieldsValue({
          name: res.name,
          code: res.code,
        });
      })
      .catch((error) => {
        message.error(error?.response?.data);
      });
    setIsChanged(false);
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
            onSave={onSave}
            onReload={fetchStockWarehouseInfoData}
          />
          <Card style={{ borderWidth: "5px" }}>
            <Form
              form={formGeneralInfo}
              onValuesChange={(value: FormGeneralInfo) => {
                setIsChanged(true);
              }}
              wrapperCol={{ span: 12 }}
              layout="vertical"
            >
              <Form.Item
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please input name!",
                  },
                ]}
                label={
                  <p style={{ fontSize: "14px", fontWeight: "500" }}>Name</p>
                }
              >
                <Input
                  placeholder="Name"
                  variant="filled"
                  onChange={handleInputNameChange}
                />
              </Form.Item>
              <Form.Item
                name="code"
                rules={[
                  {
                    required: true,
                    message: "Please input code!",
                  },
                ]}
                label={
                  <p style={{ fontSize: "14px", fontWeight: "500" }}>Code</p>
                }
              >
                <Input
                  placeholder="Code"
                  variant="filled"
                  onChange={handleInputCodeChange}
                />
              </Form.Item>
            </Form>
            <Tabs
              type="card"
              items={[
                {
                  label: `Locations`,
                  key: "1",
                  children: (
                    <>
                      <Row>
                        <Col span={12}>
                          <Form.Item label="Warehouse view location">
                            <Link href="#">
                              {stockWarehouseInfo?.viewLocation.completeName}
                            </Link>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="Location Stock">
                            <Link href="#">
                              {stockWarehouseInfo?.lotStock.completeName}
                            </Link>
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <Form.Item label="Input Location">
                            <Link href="#">
                              {stockWarehouseInfo?.whInputStockLoc.completeName}
                            </Link>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="Quality Control Location">
                            <Link href="#">
                              {stockWarehouseInfo?.whQcStockLoc.completeName}
                            </Link>
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <Form.Item label="Packing Location">
                            <Link href="#">
                              {stockWarehouseInfo?.whPackStockLoc.completeName}
                            </Link>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="Output Location">
                            <Link href="#">
                              {
                                stockWarehouseInfo?.whOutputStockLoc
                                  .completeName
                              }
                            </Link>
                          </Form.Item>
                        </Col>
                      </Row>
                    </>
                  ),
                },
                {
                  label: `Operation Types`,
                  key: "2",
                  children: (
                    <>
                      {stockWarehouseInfo?.stockPickingTypes.map((spt, index) =>
                        index % 2 === 0 ? (
                          <Row key={index}>
                            <Col span={12}>
                              <Form.Item label={`${spt.name}`}>
                                <Link href="#">{spt.barcode}</Link>
                              </Form.Item>
                            </Col>
                            {index + 1 <
                              stockWarehouseInfo?.stockPickingTypes.length && (
                              <Col span={12}>
                                <Form.Item
                                  label={`${
                                    stockWarehouseInfo?.stockPickingTypes[
                                      index + 1
                                    ].name
                                  }`}
                                >
                                  <Link href="#">
                                    {
                                      stockWarehouseInfo?.stockPickingTypes[
                                        index + 1
                                      ].barcode
                                    }
                                  </Link>
                                </Form.Item>
                              </Col>
                            )}
                          </Row>
                        ) : null
                      )}
                    </>
                  ),
                },
              ]}
            />
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
