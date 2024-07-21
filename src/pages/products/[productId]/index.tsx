"use client";
import { handleBreadCumb } from "@utils/helpers";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
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
  Card,
  Col,
  Divider,
  Form,
  Input,
  message,
  Pagination,
  Row,
  Select,
  Tabs,
} from "antd";
import BreadcrumbComponent from "@components/breadcrumb/BreadcrumbComponent";
import FlexButtons from "@components/button/FlexButtons";
import { OptionType } from "@models/base";
import uomUomServices from "@services/uomUom";
import { useRouter } from "next/router";
const { Option } = Select;
const { TextArea } = Input;

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});

interface Props {
  productId: string;
  accessToken: string;
  itemBrs: ItemType[];
}

interface FormGeneralInfo {
  productTemplateDetailedType: string;
  productTemplateCategory: string;
  productTemplateUomUom: string;
  productTemplateDescription: string;
}

interface FormName {
  productTemplateName: string;
}

const ProductInfoPage: React.FC<Props> = (props) => {
  const router = useRouter();
  const [formGeneralInfo] = Form.useForm<FormGeneralInfo>();
  const [formName] = Form.useForm<FormName>();
  const { productId, accessToken, itemBrs } = props;
  const [productTemplateInfo, setProductTemplateInfo] =
    useState<ProductTemplateInfo>();
  const [uomUomOptions, setUomUomOptions] = useState<OptionType[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<OptionType[]>([]);
  const [isChanged, setIsChanged] = useState(false);

  const handletProductTemplateNameChange = (event) => {
    if (event.target.value === "") {
      formName.setFieldsValue({ productTemplateName: undefined });
    } else {
      formName.setFieldsValue({ productTemplateName: event.target.value });
    }
  };

  const handletProductTemplateDescriptionChange = (event) => {
    formGeneralInfo.setFieldsValue({
      productTemplateDescription: event.target.value,
    });
  };

  const handleProductTemplateUomUomChange = (value: string) => {
    formGeneralInfo.setFieldsValue({ productTemplateUomUom: value });
  };

  const handleProductTemplateCategoryChange = (value: string) => {
    formGeneralInfo.setFieldsValue({ productTemplateCategory: value });
  };

  const handleProductTemplateDetailedTypeChange = (value: string) => {
    formGeneralInfo.setFieldsValue({ productTemplateDetailedType: value });
  };

  const fetchProductTemplateInfoData = useCallback(async () => {
    if (productId !== "new") {
      await productTemplateServices
        .getProductTemplateInfo(accessToken, productId)
        .then((res) => {
          setProductTemplateInfo({ ...res });
          formName.setFieldsValue({ productTemplateName: res.name });
          formGeneralInfo.setFieldsValue({
            productTemplateDetailedType: res.detailedType,
            productTemplateUomUom: res.uomUom.id,
            productTemplateCategory: res.productCategory.id,
            productTemplateDescription: res.description,
          });
        })
        .catch((error) => {
          // message.error(error?.response?.data);
        });
    } else {
      formGeneralInfo.resetFields();
      formName.resetFields();
    }
    setIsChanged(false);
  }, []);

  const fetchForSelectUomUom = async () => {
    await uomUomServices
      .getUomUomForSelect(accessToken)
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

  const fetchForSelectCategory = async () => {
    await productCategoryServices
      .getProductCategorySelect(accessToken)
      .then((res) => {
        const options: OptionType[] = res.map((item) => ({
          value: item.id,
          label: item.completeName,
        })) as any;
        setCategoryOptions(options);
      })
      .catch((error) => {
        message.error(error?.response?.data);
      });
  };

  const onSave = async () => {
    await formName.validateFields();
    await formGeneralInfo.validateFields();
    if (productId === "new") {
      const data = {} as ProductTemplateCreate;
      data.name = formName.getFieldsValue().productTemplateName;
      data.detailedType =
        formGeneralInfo.getFieldsValue().productTemplateDetailedType!;
      data.categId = formGeneralInfo.getFieldsValue().productTemplateCategory!;
      data.uomId = formGeneralInfo.getFieldsValue().productTemplateUomUom!;
      data.tracking = "No";
      data.description =
        formGeneralInfo.getFieldsValue().productTemplateDescription ?? "";
      await productTemplateServices
        .createProductTemplate(accessToken, data)
        .then((res) => {
          router.push(`/products/${res?.id}`).then(() => {
            router.reload();
          });
        })
        .catch((error) => message.error(error));
    } else {
      await productTemplateServices
        .updateProductTemplate(accessToken, {
          id: productId,
          name: formName.getFieldsValue().productTemplateName,
          categId: formGeneralInfo.getFieldsValue().productTemplateCategory,
          uomId: formGeneralInfo.getFieldsValue().productTemplateUomUom,
          detailedType:
            formGeneralInfo.getFieldsValue().productTemplateDetailedType,
          description:
            formGeneralInfo.getFieldsValue().productTemplateDescription,
        } as ProductTemplateUpdate)
        .then(() => {
          message.success("The product has been updated!");
          fetchProductTemplateInfoData();
        })
        .catch((error) => {
          message.error(error?.response?.data);
        });
    }
  };

  useEffect(() => {
    fetchProductTemplateInfoData();
  }, [fetchProductTemplateInfoData]);

  useEffect(() => {
    fetchForSelectUomUom();
  }, []);

  useEffect(() => {
    fetchForSelectCategory();
  }, []);
  return (
    <AntdLayoutNoSSR
      content={
        <>
          <BreadcrumbComponent itemBreadcrumbs={itemBrs} />
          <FlexButtons
            isChanged={isChanged}
            onSave={onSave}
            onReload={fetchProductTemplateInfoData}
          />
          <Card style={{ borderWidth: "5px" }}>
            <Form
              onValuesChange={(value: FormName) => {
                setIsChanged(true);
              }}
              form={formName}
              wrapperCol={{ span: 12 }}
              layout="vertical"
            >
              <Form.Item
                name="productTemplateName"
                rules={[
                  {
                    required: true,
                    message: "Please input the product name!",
                  },
                ]}
                label={
                  <p style={{ fontSize: "14px", fontWeight: "500" }}>
                    Product Name
                  </p>
                }
              >
                <Input
                  placeholder="Product Name"
                  variant="filled"
                  onChange={handletProductTemplateNameChange}
                />
              </Form.Item>
            </Form>
            <Tabs
              type="card"
              items={[
                {
                  label: `General Information`,
                  key: "1",
                  children: (
                    <>
                      <Form
                        wrapperCol={{ span: 12 }}
                        labelCol={{ span: 6 }}
                        labelAlign="left"
                        form={formGeneralInfo}
                        onValuesChange={(value: FormGeneralInfo) => {
                          setIsChanged(true);
                        }}
                      >
                        <Row gutter={24}>
                          <Col span={12}>
                            <Form.Item
                              name="productTemplateDetailedType"
                              rules={[
                                {
                                  required: true,
                                  message: "Please input the product type!",
                                },
                              ]}
                              label={
                                <p
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: "500",
                                  }}
                                >
                                  Product Type
                                </p>
                              }
                            >
                              <Select
                                className="custom-select"
                                style={{ width: "100%" }}
                                variant="borderless"
                                options={[
                                  {
                                    value: "consu",
                                    label: "Consumable",
                                  },
                                  {
                                    value: "service",
                                    label: "Service",
                                  },
                                  {
                                    value: "product",
                                    label: "Storable Product",
                                  },
                                ]}
                                // value={productTemplateDetailedType}
                                onChange={
                                  handleProductTemplateDetailedTypeChange
                                }
                              ></Select>
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              name="productTemplateUomUom"
                              rules={[
                                {
                                  required: true,
                                  message: "Please input the Unit of Measure!",
                                },
                              ]}
                              label={
                                <p
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: "500",
                                  }}
                                >
                                  Unit of Measure
                                </p>
                              }
                            >
                              <Select
                                className="custom-select"
                                style={{ width: "100%" }}
                                variant="borderless"
                                onChange={handleProductTemplateUomUomChange}
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
                          </Col>
                        </Row>
                        <Row gutter={24}>
                          <Col span={12}>
                            <Form.Item
                              name="productTemplateCategory"
                              rules={[
                                {
                                  required: true,
                                  message: "Please input the product category!",
                                },
                              ]}
                              label={
                                <p
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: "500",
                                  }}
                                >
                                  Product Category
                                </p>
                              }
                            >
                              <Select
                                className="custom-select"
                                style={{ width: "100%" }}
                                variant="borderless"
                                onChange={handleProductTemplateCategoryChange}
                              >
                                {categoryOptions.map((option) => (
                                  <Option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                        </Row>
                        <Divider orientation="left">Description</Divider>
                        <Row gutter={24}>
                          <Col span={24}>
                            <Form.Item
                              layout="vertical"
                              name="productTemplateDescription"
                              wrapperCol={{ span: 24 }}
                            >
                              <TextArea
                                placeholder="Description"
                                // variant="borderless"
                                // width={"100%"}
                                onChange={
                                  handletProductTemplateDescriptionChange
                                }
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Form>
                    </>
                  ),
                },
                {
                  label: `Attributes & Variants`,
                  key: "2",
                  children: <></>,
                },
                {
                  label: `Inventory`,
                  key: "3",
                  children: <></>,
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
  const productId = context.query.productId!;
  const accessToken = session?.user?.access_token!;
  const itemBrs = handleBreadCumb(context.resolvedUrl);
  return {
    props: {
      productId: productId.toString(),
      accessToken: accessToken?.toString(),
      itemBrs: itemBrs,
    },
  };
};
export default ProductInfoPage;
