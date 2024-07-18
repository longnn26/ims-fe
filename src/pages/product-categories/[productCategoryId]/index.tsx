"use client";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { handleBreadCumb } from "@utils/helpers";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import BreadcrumbComponent from "@components/breadcrumb/BreadcrumbComponent";
import { Form, Input, message, Select } from "antd";
import {
  ProductCategoryInfo,
  ProductCategoryUpdateInfo,
  ProductCategoryUpdateParent,
} from "@models/productCategory";
import productCategoryServices from "@services/productCategory";
import FlexButtons from "@components/button/FlexButtons";
import { OptionType } from "@models/base";
const { Option } = Select;

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});
interface Props {
  productCategoryId: string;
  accessToken: string;
  itemBrs: ItemType[];
}
const ProductCategoryInfoPage: React.FC<Props> = (props) => {
  const router = useRouter();
  const { productCategoryId, accessToken, itemBrs } = props;
  const [options, setOptions] = useState<OptionType[]>([]);
  const [productCategoryInfo, setProductCategoryInfo] =
    useState<ProductCategoryInfo>();
  const [productCategoryName, setProductCategoryName] = useState<string>();
  const [parentProductCategoryId, setParentProductCategoryId] =
    useState<string>();

  const [isChanged, setIsChanged] = useState(false);

  const handleInputNameChange = (event) => {
    setProductCategoryName(event.target.value);
  };

  const handleSelectParentChange = (value: string) => {
    setParentProductCategoryId(value);
  };

  const fetchProductCategoryInfoData = useCallback(async () => {
    await productCategoryServices
      .getProductCategoryInfo(accessToken, productCategoryId)
      .then((res) => {
        setProductCategoryInfo({ ...res });
        setProductCategoryName(res.name);
        setParentProductCategoryId(res.parentCategory?.id);
      })
      .catch((error) => {
        message.error(error?.response?.data);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchForSelectParent = async () => {
    await productCategoryServices
      .getForSelectParent(accessToken, productCategoryId)
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

  const updateProductCategory = async () => {
    if (productCategoryName !== productCategoryInfo?.name) {
      await productCategoryServices
        .updateProductCategoryInfo(accessToken, {
          id: productCategoryId,
          name: productCategoryName,
        } as ProductCategoryUpdateInfo)
        .then(() => {
          fetchProductCategoryInfoData();
        })
        .catch((error) => {
          message.error(error?.response?.data);
        });
    }
    if (parentProductCategoryId != productCategoryInfo?.parentCategory?.id) {
      await productCategoryServices
        .updateProductCategoryParent(accessToken, {
          id: productCategoryId,
          parentId: parentProductCategoryId,
        } as ProductCategoryUpdateParent)
        .then(() => {
          fetchProductCategoryInfoData();
        })
        .catch((error) => {
          message.error(error?.response?.data);
        });
    }
  };

  useEffect(() => {
    if (productCategoryName !== undefined) {
      if (
        productCategoryName !== productCategoryInfo?.name ||
        parentProductCategoryId != productCategoryInfo.parentCategory?.id
      ) {
        setIsChanged(true);
      } else {
        setIsChanged(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    productCategoryName,
    productCategoryInfo?.name,
    parentProductCategoryId,
    productCategoryInfo?.parentCategory?.id,
  ]);

  useEffect(() => {
    fetchProductCategoryInfoData();
  }, [fetchProductCategoryInfoData]);

  useEffect(() => {
    fetchForSelectParent();
  }, []);
  return (
    <AntdLayoutNoSSR
      content={
        <>
          <BreadcrumbComponent itemBreadcrumbs={itemBrs} />
          <FlexButtons
            isChanged={isChanged}
            onSave={updateProductCategory}
            onReload={fetchProductCategoryInfoData}
          />
          <Form.Item
            label={
              <p style={{ fontSize: "14px", fontWeight: "500" }}>Category</p>
            }
          >
            <Input
              placeholder="Category"
              variant="filled"
              value={productCategoryName}
              onChange={handleInputNameChange}
            />
          </Form.Item>{" "}
          <Form.Item
            label={
              <p style={{ fontSize: "14px", fontWeight: "500" }}>
                Parent Category
              </p>
            }
          >
            <Select
              style={{ width: "100%" }}
              variant="filled"
              value={parentProductCategoryId}
              onChange={handleSelectParentChange}
            >
              {options.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </>
      }
    />
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const session = await getSession(context);
  const uomCategoryId = context.query.productCategoryId!;
  const accessToken = session?.user?.access_token!;
  const itemBrs = handleBreadCumb(context.resolvedUrl);
  return {
    props: {
      productCategoryId: uomCategoryId.toString(),
      accessToken: accessToken?.toString(),
      itemBrs: itemBrs,
    },
  };
};

export default ProductCategoryInfoPage;
