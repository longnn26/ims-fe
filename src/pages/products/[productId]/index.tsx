"use client";
import { handleBreadCumb } from "@utils/helpers";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useState } from "react";
import productTemplateServices from "@services/productTemplate";
import { ProductTemplateInfo } from "@models/productTemplate";
import { Card, Form, Input, message, Pagination, Select, Tabs } from "antd";
import BreadcrumbComponent from "@components/breadcrumb/BreadcrumbComponent";
import FlexButtons from "@components/button/FlexButtons";
import { OptionType } from "@models/base";
import uomUomServices from "@services/uomUom";
import productCategoryServices from "@services/productCategory";
const { Option } = Select;

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});

interface Props {
  productId: string;
  accessToken: string;
  itemBrs: ItemType[];
}

const ProductInfoPage: React.FC<Props> = (props) => {
  const { productId, accessToken, itemBrs } = props;
  const [productTemplateInfo, setProductTemplateInfo] =
    useState<ProductTemplateInfo>();
  const [productTemplateName, setProductTemplateName] = useState<string>();
  const [productTemplateDetailedType, setProductTemplateDetailedType] =
    useState<string>();
  const [productTemplateUomUom, setProductTemplateUomUom] = useState<string>();
  const [productTemplateCategory, setProductTemplateCategory] =
    useState<string>();
  const [uomUomOptions, setUomUomOptions] = useState<OptionType[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<OptionType[]>([]);
  const [isChanged, setIsChanged] = useState(false);

  const fetchProductTemplateInfoData = useCallback(async () => {
    if (productId !== "new") {
      await productTemplateServices
        .getProductTemplateInfo(accessToken, productId)
        .then((res) => {
          setProductTemplateInfo({ ...res });
          setProductTemplateName(res.name);
          setProductTemplateDetailedType(res.detailedType);
          setProductTemplateUomUom(res.uomUom.id);
          setProductTemplateCategory(res.productCategory.id);
        })
        .catch((error) => {
          // message.error(error?.response?.data);
        });
    }
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

  useEffect(() => {
    fetchProductTemplateInfoData();
  }, [fetchProductTemplateInfoData]);

  useEffect(() => {
    fetchForSelectUomUom();
  }, []);

  useEffect(() => {
    fetchForSelectCategory();
  }, []);

  useEffect(() => {
    if (productTemplateName !== undefined) {
      if (productTemplateName !== productTemplateInfo?.name) {
        setIsChanged(true);
      } else {
        setIsChanged(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productTemplateName, productTemplateInfo?.name]);
  return (
    <AntdLayoutNoSSR
      content={
        <>
          <BreadcrumbComponent itemBreadcrumbs={itemBrs} />
          <FlexButtons
            isChanged={isChanged}
            onSave={() => {}}
            onReload={() => {}}
          />
          <Card style={{ borderWidth: "5px" }}>
            <Form wrapperCol={{ span: 12 }} layout="vertical">
              <Form.Item
                label={
                  <p style={{ fontSize: "14px", fontWeight: "500" }}>
                    Product Name
                  </p>
                }
              >
                <Input
                  placeholder="Category"
                  variant="filled"
                  value={productTemplateName}
                  // onChange={handleInputNameChange}
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
                      <Form wrapperCol={{ span: 12 }} layout="vertical">
                        <Form.Item
                          label={
                            <p style={{ fontSize: "14px", fontWeight: "500" }}>
                              Product Type
                            </p>
                          }
                        >
                          <Select
                            style={{ width: "100%" }}
                            variant="outlined"
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
                            value={productTemplateDetailedType}
                            // onChange={handleSelectParentChange}
                          ></Select>
                        </Form.Item>
                        <Form.Item
                          label={
                            <p style={{ fontSize: "14px", fontWeight: "500" }}>
                              Unit of Measure
                            </p>
                          }
                        >
                          <Select
                            style={{ width: "100%" }}
                            variant="outlined"
                            value={productTemplateUomUom}
                          >
                            {uomUomOptions.map((option) => (
                              <Option key={option.value} value={option.value}>
                                {option.label}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                        <Form.Item
                          label={
                            <p style={{ fontSize: "14px", fontWeight: "500" }}>
                              Product Category
                            </p>
                          }
                        >
                          <Select
                            style={{ width: "100%" }}
                            variant="outlined"
                            value={productTemplateCategory}
                          >
                            {categoryOptions.map((option) => (
                              <Option key={option.value} value={option.value}>
                                {option.label}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Form>
                    </>
                  ),
                },
                {
                  label: `Attributes & Variants`,
                  key: "2",
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
