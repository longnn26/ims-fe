/* eslint-disable jsx-a11y/alt-text */
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
  Image,
  Space,
  Upload,
  UploadFile,
  Popconfirm,
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
import { url } from "@utils/api-links";
import { imageNotFound } from "@utils/constants";
import { relative } from "path";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

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
  const dispatch = useDispatch();
  const [formGeneralInfo] = Form.useForm<FormGeneralInfo>();
  const [formName] = Form.useForm<FormName>();
  const { productId, accessToken, itemBrs } = props;
  const { data, pageIndex, pageSize, totalPage } = useSelector(
    (state) => state.productTemplateAttributeLine
  );

  const [productTemplateInfo, setProductTemplateInfo] =
    useState<ProductTemplateInfo>();
  const [uomUomOptions, setUomUomOptions] = useState<OptionType[]>([]);
  const [productTmplAttOptions, setProductTmplAttOptions] = useState<
    OptionType[]
  >([]);
  const [categoryOptions, setCategoryOptions] = useState<OptionType[]>([]);
  const [isChanged, setIsChanged] = useState(false);
  const [openAddAttribute, setOpenAddAttribute] = useState(false);

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

  const fetchForSelectAttribute = async () => {
    await productAttributeServices
      .getProductAttributeForSelect(accessToken)
      .then((res) => {
        const options: OptionType[] = res.map((item) => ({
          value: item.id,
          label: item.name,
        })) as any;
        setProductTmplAttOptions(options);
      })
      .catch((error) => {
        // message.error(error?.response?.data);
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

  const createProductAttributeValue = async (
    data: ProductTemplateAttributeLineCreate
  ) => {
    await productTemplateAttributeLineServices
      .createProductTemplateAttributeLine(accessToken, data)
      .then(() => {
        dispatch(
          getProductTemplateAttributeLines({
            token: accessToken,
            productTmplId: productId,
          })
        );
        setOpenAddAttribute(false);
      })
      .catch((error) => {
        message.error(error?.response?.data);
      });
  };

  const updateImage = async (file) => {
    var data = new FormData();
    data.append("File", file);
    await productTemplateServices
      .updateImage(accessToken, productId, data)
      .then((res) => {
        message.success("Update Image successfully!");
        fetchProductTemplateInfoData();
      })
      .catch((errors) => {
        message.error(errors.response.data);
      });
  };

  const deleteImage = async () => {
    await productTemplateServices
      .deleteImage(accessToken, productId)
      .then(() => {
        fetchProductTemplateInfoData();
      })
      .catch((error) => {
        message.error(error?.response?.data);
      });
  };

  const fetchProductTemplateAttributeLineData = useCallback(() => {
    dispatch(
      getProductTemplateAttributeLines({
        token: accessToken,
        productTmplId: productId,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex]);

  useEffect(() => {
    fetchProductTemplateInfoData();
  }, [fetchProductTemplateInfoData]);

  useEffect(() => {
    fetchProductTemplateAttributeLineData();
  }, [fetchProductTemplateAttributeLineData]);

  useEffect(() => {
    Promise.all([
      fetchForSelectUomUom(),
      fetchForSelectCategory(),
      fetchForSelectAttribute(),
    ]).catch((error) => {});
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      dispatch(resetData());
    };

    router.events.on("routeChangeStart", handleRouteChange);

    // Clean up the event listener on component unmount
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router, dispatch]);
  return (
    <AntdLayoutNoSSR
      content={
        <>
          <BreadcrumbComponent itemBreadcrumbs={itemBrs} />
          <Divider orientation="left" orientationMargin="0">
            Product Detail
          </Divider>
          <div className="flex justify-start mt-5">
            <Button
              shape="default"
              icon={<PiTreeStructureFill />}
              onClick={() => {
                router.push(`/products/${productId}/variants`);
              }}
            >
              {`Variants: `}{" "}
              <p className="font-bold">{productTemplateInfo?.totalVariant}</p>
            </Button>
            <Button
              shape="default"
              icon={<FaBoxes />}
              onClick={() => {
                router.push(`/products/${productId}/quantity`);
              }}
            >
              {`On Hand: `}{" "}
              <p className="font-bold">{productTemplateInfo?.qtyAvailable}</p>
            </Button>
          </div>
          <FlexButtons
            isChanged={isChanged}
            onSave={onSave}
            onReload={fetchProductTemplateInfoData}
          />
          <Card style={{ borderWidth: "5px" }}>
            <div className="absolute right-5 z-10">
              <Image
                style={{
                  width: "100px",
                  height: "100px",
                }}
                src={`${
                  productTemplateInfo?.imageUrl
                    ? `${url}/${productTemplateInfo?.imageUrl}`
                    : `${imageNotFound}`
                }`}
              />
              <Upload
                showUploadList={false}
                className=" absolute bottom-0 left-0 z-20"
                beforeUpload={(file) => {
                  updateImage(file);
                }}
              >
                <Button shape="circle" type="dashed">
                  <MdEdit className="cursor-pointer"></MdEdit>
                </Button>
              </Upload>
              <div className=" absolute bottom-0 right-0 z-20">
                <Popconfirm
                  title="Sure to delete image?"
                  onConfirm={() => {
                    deleteImage();
                  }}
                >
                  <Button shape="circle" type="dashed">
                    <MdDelete className="cursor-pointer"></MdDelete>
                  </Button>
                </Popconfirm>
              </div>
            </div>
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
              color="green"
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
                  children: (
                    <>
                      {Boolean(productId !== "new") && (
                        <>
                          <ProductTemplateAttributeLineTable
                            productTmplId={productId}
                            accessToken={accessToken}
                          />
                          <Button
                            type="dashed"
                            onClick={() => setOpenAddAttribute(true)}
                            style={{ width: "100%", marginTop: "20px" }}
                            icon={<PlusOutlined />}
                          >
                            Add Attribute
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
                            open={openAddAttribute}
                            okText="Add"
                            cancelText="Cancel"
                            okButtonProps={{
                              autoFocus: true,
                              htmlType: "submit",
                            }}
                            onCancel={() => setOpenAddAttribute(false)}
                            destroyOnClose
                            modalRender={(dom) => (
                              <Form
                                layout="vertical"
                                name="form_in_modal"
                                // initialValues={{ modifier: "public" }}
                                clearOnDestroy
                                onFinish={(values) =>
                                  createProductAttributeValue(values)
                                }
                              >
                                {dom}
                              </Form>
                            )}
                          >
                            <Form.Item
                              name="attributeId"
                              label="Attribute"
                              rules={[
                                {
                                  required: true,
                                  message: "Please select Attribute!",
                                },
                              ]}
                            >
                              <Select style={{ width: "100%" }}>
                                {productTmplAttOptions.map((option) => (
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
                              hidden={true}
                              name="productTmplId"
                              initialValue={productId}
                            ></Form.Item>
                          </Modal>
                        </>
                      )}
                    </>
                  ),
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
