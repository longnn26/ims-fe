"use client";
import {
  getStockPickingTagColor,
  getStockPickingTitle,
  handleBreadCumb,
} from "@utils/helpers";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { GetServerSideProps } from "next";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import { getSession } from "next-auth/react";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useState } from "react";
import productProductServices from "@services/productProduct";
import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Drawer,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Pagination,
  Row,
  Select,
  Tabs,
  Tooltip,
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
import stockMoveServices from "@services/stockMove";
import { StockWarehouseInfo } from "@models/stockWarehouse";
import moment from "moment";
import { dateAdvFormat } from "@utils/constants";
import dayjs from "dayjs";
import { getStockMoves } from "@slices/stockMove";
import StockMoveTable from "@components/stockPicking/StockMoveTable";
import { setPageIndex } from "@slices/stockMove";
import { PlusOutlined } from "@ant-design/icons";
import { StockMoveCreate } from "@models/stockMove";
import { setSearchText } from "@slices/stockPickingIncoming";
import { FaBoxes, FaSearch } from "react-icons/fa";
import StockQuantLocationTable from "@components/stockLocation/StockQuantLocationTable";
import {
  setPageIndex as setPageIndexStockQuantLocation,
  setPageSize as setPageSizeStockQuantLocation,
  setSearchText as setSearchTextStockQuantLocation,
} from "@slices/stockQuantLocation";

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

interface FormStockMove {
  productId: string;
  productUomId: string;
  pickingId: string;
  locationId: string;
  locationDestId: string;
  productUomQty: number;
}

const ProductInfoPage: React.FC<Props> = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { warehouseId, stockPickingId, accessToken, itemBrs } = props;

  const { data, pageIndex, pageSize, totalPage } = useSelector(
    (state) => state.stockMove
  );

  const {
    data: dataStockQuantLocation,
    pageIndex: pageIndexStockQuantLocation,
    pageSize: pageSizeStockQuantLocation,
    totalSize: totalSizeStockQuantLocation,
    searchText: searchTextStockQuantLocation,
  } = useSelector((state) => state.stockQuantLocation);

  const [formStockPicking] = Form.useForm<FormStockPicking>();
  const [formStockMove] = Form.useForm<FormStockMove>();
  const [stockPickingInfo, setStockPickingInfo] = useState<StockPickingInfo>();
  const [stockWarehouseInfo, setStockWarehouseInfo] =
    useState<StockWarehouseInfo>();
  const [scheduledDate, setScheduledDate] = useState<string>();
  const [dateDeadline, setDateDeadline] = useState<string>();
  const [isChanged, setIsChanged] = useState(false);
  const [openAddStockMove, setOpenAddStockMove] = useState(false);

  const [stockQuantLocationId, setStockQuantLocationId] = useState<
    string | undefined
  >();

  const [locationOptions, setLocationOptions] = useState<OptionType[]>([]);

  const [productVariantOptions, setProductVarianOptions] = useState<
    OptionType[]
  >([]);

  const [uomUomOptions, setUomUomOptions] = useState<OptionType[]>([]);

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
          router
            .push(`/overview/${warehouseId}/incoming/${res?.id}`)
            .then(() => {
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

  const onSaveStockMove = async () => {
    await formStockMove.validateFields();
    const data = formStockMove.getFieldsValue() as StockMoveCreate;
    await stockMoveServices
      .createStockMove(accessToken, data)
      .then((res) => {
        fetchStockMoveData();
        setOpenAddStockMove(false);
      })
      .catch((error) => {
        message.error(error?.response?.data);
      });
  };

  const makeAsTodo = async () => {
    await stockLPickingServices
      .makeAsTodo(accessToken, stockPickingId)
      .then((res) => {
        fetchStockMoveData();
        fetchStockPickingInfoData();
      })
      .catch((error) => {
        message.error(error?.response?.data);
      });
  };

  const cancel = async () => {
    await stockLPickingServices
      .cancel(accessToken, stockPickingId)
      .then((res) => {
        fetchStockMoveData();
        fetchStockPickingInfoData();
      })
      .catch((error) => {
        message.error(error?.response?.data);
      });
  };

  const validate = async () => {
    await stockLPickingServices
      .validate(accessToken, stockPickingId)
      .then((res) => {
        fetchStockMoveData();
        fetchStockPickingInfoData();
      })
      .catch((error) => {
        message.error(error?.response?.data);
      });
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

  const fetchLocations = async () => {
    await stockLocationServices
      .getLocationWarehouse(accessToken, warehouseId)
      .then((res) => {
        const options: OptionType[] = res.map((item) => ({
          value: item.id,
          label: item.completeName,
        })) as any;
        setLocationOptions(options);
      })
      .catch((error) => {
        message.error(error?.response?.data);
      });
  };

  const fetchProductVariantForSelect = async () => {
    await productProductServices
      .getProductVariantForSelect(accessToken)
      .then((res) => {
        const options: OptionType[] = res.map((item) => ({
          value: item.id,
          label: `${item.name} (${item.pvcs
            .map((pvc) => `${pvc.value}`)
            .join(", ")})`,
        })) as any;
        setProductVarianOptions(options);
      })
      .catch((error) => {
        message.error(error?.response?.data);
      });
  };

  const fetchForSelectUomUom = async (productId: string) => {
    await productProductServices
      .getUomUomForSelect(accessToken, productId)
      .then((res) => {
        const options: OptionType[] = res.map((item) => ({
          value: item.id,
          label: item.name,
        })) as any;
        setUomUomOptions(options);
      })
      .catch((error) => {
        message.error(error?.response?.data);
      });
  };

  const fetchStockMoveData = useCallback(() => {
    dispatch(
      getStockMoves({
        token: accessToken,
        pickingId: stockPickingId,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex]);

  useEffect(() => {
    fetchStockWarehouseInfoData();
    fetchLocations();
    fetchStockPickingInfoData();
  }, []);

  useEffect(() => {
    fetchStockMoveData();
  }, [fetchStockMoveData]);

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
          <div>
            {Boolean(
              stockPickingId !== "new" &&
                Boolean(
                  stockPickingInfo?.state === "Draft" ||
                    stockPickingInfo?.state === "Waiting"
                )
            ) && (
              <Button
                type="primary"
                className="mr-1"
                onClick={() => {
                  makeAsTodo();
                }}
              >
                Make As Todo
              </Button>
            )}
            {Boolean(
              stockPickingId !== "new" && stockPickingInfo?.state === "Assigned"
            ) && (
              <Button
                type="primary"
                className="mr-1"
                onClick={() => {
                  validate();
                }}
              >
                Validate
              </Button>
            )}
            {Boolean(
              stockPickingId !== "new" &&
                stockPickingInfo?.state !== "Cancelled" &&
                stockPickingInfo?.state !== "Done"
            ) && (
              <Button
                className="mr-1"
                onClick={() => {
                  cancel();
                }}
              >
                Cancel
              </Button>
            )}
          </div>
          <FlexButtons
            isChanged={isChanged}
            onSave={onSave}
            onReload={fetchStockPickingInfoData}
          />{" "}
          <Badge.Ribbon
            text={getStockPickingTitle(stockPickingInfo?.state)}
            color={getStockPickingTagColor(stockPickingInfo?.state)}
          >
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
                      <Select
                        style={{ width: "100%" }}
                        variant="filled"
                      ></Select>
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
                        showSearch
                        optionFilterProp="children"
                        dropdownMatchSelectWidth={false}
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
                      <DatePicker
                        allowClear={false}
                        value={
                          stockPickingInfo?.dateDone
                            ? dayjs(stockPickingInfo?.dateDone)
                            : undefined
                        }
                        showTime
                        disabled
                        placeholder="Effective Date"
                      />
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
                      <Select
                        showSearch
                        optionFilterProp="children"
                        dropdownMatchSelectWidth={false}
                        style={{ width: "100%" }}
                        variant="filled"
                      >
                        {locationOptions.map((option) => (
                          <Option key={option.value} value={option.value}>
                            {option.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    {Boolean(stockPickingInfo?.locationDestId) ? (
                      <Tooltip
                        key="variant"
                        title={`View Stock Quantity`}
                        className="absolute top-0 right-16"
                      >
                        <Button
                          shape="circle"
                          type="dashed"
                          onClick={() => {
                            setStockQuantLocationId(
                              stockPickingInfo?.locationDestId
                            );
                          }}
                        >
                          <FaBoxes />
                        </Button>
                      </Tooltip>
                    ) : undefined}
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
                {stockPickingInfo?.backorder && (
                  <>
                    <Divider orientation="left">Back Order of</Divider>
                    <Row gutter={24}>
                      <Col span={24}>
                        <TextArea
                          onClick={() => {
                            router
                              .push(
                                `/overview/${warehouseId}/${stockPickingInfo.backorderId}`
                              )
                              .then(() => router.reload());
                          }}
                          className="cursor-pointer"
                          placeholder="Back Order of"
                          value={stockPickingInfo.backorder.name}
                          rows={1}
                          variant="filled"
                          readOnly
                        />
                      </Col>
                    </Row>
                  </>
                )}
                <Divider orientation="left">Note</Divider>
                <Row gutter={24}>
                  <Col span={24}>
                    <Form.Item name="note" wrapperCol={{ span: 24 }}>
                      <TextArea placeholder="Description" />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
              <Tabs
                color="green"
                type="card"
                items={[
                  {
                    label: `Operations`,
                    key: "1",
                    children: (
                      <>
                        {Boolean(stockPickingId !== "new") && (
                          <>
                            <StockMoveTable
                              onRefresh={fetchStockPickingInfoData}
                              accessToken={accessToken}
                              pickingId={stockPickingId}
                            />
                            <Button
                              type="dashed"
                              onClick={() => {
                                setOpenAddStockMove(true);
                                fetchProductVariantForSelect();
                              }}
                              style={{ width: "100%", marginTop: "20px" }}
                              icon={<PlusOutlined />}
                            >
                              Add a line
                            </Button>
                            {data?.length > 0 && (
                              <Pagination
                                className="text-end m-4"
                                current={pageIndex}
                                pageSize={pageSize}
                                total={totalPage}
                                onChange={(page) => {
                                  dispatch(setPageIndex(page));
                                }}
                              />
                            )}
                            <Modal
                              open={openAddStockMove}
                              okText="Add"
                              cancelText="Cancel"
                              okButtonProps={{
                                autoFocus: true,
                                htmlType: "submit",
                              }}
                              onCancel={() => {
                                setOpenAddStockMove(false);
                              }}
                              onOk={() => {
                                onSaveStockMove();
                              }}
                              destroyOnClose
                              modalRender={(dom) => (
                                <Form
                                  layout="vertical"
                                  name="form_in_modal"
                                  initialValues={{ modifier: "public" }}
                                  form={formStockMove}
                                  clearOnDestroy
                                  onFinish={(values) => {
                                    // createProductAttributeValue(values)
                                  }}
                                >
                                  {dom}
                                </Form>
                              )}
                            >
                              <Form.Item
                                name="productId"
                                label="Product"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please select Attribute!",
                                  },
                                ]}
                              >
                                <Select
                                  showSearch
                                  optionFilterProp="children"
                                  dropdownMatchSelectWidth={false}
                                  style={{ width: "100%" }}
                                  variant="filled"
                                  onChange={(value) =>
                                    fetchForSelectUomUom(value)
                                  }
                                >
                                  {productVariantOptions.map((option) => (
                                    <Option
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                              <Form.Item
                                name="productUomId"
                                label="Unit"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please select Unit!",
                                  },
                                ]}
                              >
                                <Select
                                  showSearch
                                  optionFilterProp="children"
                                  dropdownMatchSelectWidth={false}
                                  style={{ width: "100%" }}
                                  variant="filled"
                                >
                                  {uomUomOptions.map((option) => (
                                    <Option
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                              <Form.Item
                                name="productUomQty"
                                label="Demand"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please input Demand!",
                                  },
                                  {
                                    type: "number",
                                    min: 1,
                                    max: 100000,
                                    message:
                                      "Quantity must be between 1 and 100000.",
                                  },
                                ]}
                              >
                                <InputNumber variant="filled" />
                              </Form.Item>
                              <Form.Item
                                hidden={true}
                                name="pickingId"
                                initialValue={stockPickingId}
                              ></Form.Item>
                              <Form.Item
                                hidden={true}
                                name="locationId"
                                initialValue={stockPickingInfo?.location.id}
                              ></Form.Item>
                              <Form.Item
                                hidden={true}
                                name="locationDestId"
                                initialValue={stockPickingInfo?.locationDest.id}
                              ></Form.Item>
                            </Modal>
                          </>
                        )}
                      </>
                    ),
                  },
                ]}
              />
            </Card>
          </Badge.Ribbon>
          <Drawer
            width={850}
            closable
            destroyOnClose
            title={<p>Stock Quantity</p>}
            placement="right"
            open={Boolean(stockQuantLocationId)}
            onClose={() => setStockQuantLocationId(undefined)}
          >
            <div className="flex justify-start">
              <Input
                prefix={<FaSearch />}
                className="input-search-drawer"
                placeholder="Search Product does not contain words in brackets"
                defaultValue={searchTextStockQuantLocation}
                onPressEnter={(event) => {
                  dispatch(
                    setSearchTextStockQuantLocation(event.target["value"])
                  );
                }}
              />
            </div>
            <StockQuantLocationTable
              locationId={stockQuantLocationId!}
              accessToken={accessToken}
            />
            {dataStockQuantLocation?.length > 0 && (
              <Pagination
                className="text-end m-4"
                current={pageIndexStockQuantLocation}
                pageSize={pageSizeStockQuantLocation}
                total={totalSizeStockQuantLocation}
                showSizeChanger
                onShowSizeChange={(current, pageSize) => {
                  dispatch(setPageIndexStockQuantLocation(pageSize));
                }}
                onChange={(page) => {
                  dispatch(setPageSizeStockQuantLocation(page));
                }}
              />
            )}
          </Drawer>
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
