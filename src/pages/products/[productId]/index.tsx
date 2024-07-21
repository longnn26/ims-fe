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
  const [isChanged, setIsChanged] = useState(false);

  const fetchProductTemplateInfoData = useCallback(async () => {
    await productTemplateServices
      .getProductTemplateInfo(accessToken, productId)
      .then((res) => {
        setProductTemplateInfo({ ...res });
        setProductTemplateName(res.name);
        setProductTemplateDetailedType(res.detailedType);
        setProductTemplateUomUom(res.uomUom.id);
      })
      .catch((error) => {
        message.error(error?.response?.data);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchProductTemplateInfoData();
  }, [fetchProductTemplateInfoData]);

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
                          ></Select>
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
                          ></Select>
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
