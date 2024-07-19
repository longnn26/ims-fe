"use client";
import { handleBreadCumb } from "@utils/helpers";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useState } from "react";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import {
  getProductAttributeValues,
  setPageIndex,
} from "@slices/productAttributeValue";
import { Form, Input, message, Pagination, Tabs } from "antd";
import ProductAttributeValueTable from "@components/attributes/ProductAttributeValueTable";
import productAttributeServices from "@services/productAttribute";
import {
  ProductAttributeInfo,
  ProductAttributeUpdate,
} from "@models/productAttribute";
import BreadcrumbComponent from "@components/breadcrumb/BreadcrumbComponent";
import FlexButtons from "@components/button/FlexButtons";

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});
interface Props {
  attributeId: string;
  accessToken: string;
  itemBrs: ItemType[];
}
const AttributeInfoPage: React.FC<Props> = (props) => {
  const { attributeId, accessToken, itemBrs } = props;
  const dispatch = useDispatch();
  const { data, pageIndex, pageSize, totalPage } = useSelector(
    (state) => state.productAttributeValue
  );
  const [productAttributeInfo, setProductAttributeInfo] =
    useState<ProductAttributeInfo>();
  const [productAttributeName, setProductAttributeName] = useState<
    string | undefined
  >(undefined);
  const [isChanged, setIsChanged] = useState(false);
  const handleInputNameChange = (event) => {
    setProductAttributeName(event.target.value);
  };
  const fetchProductAttributeValueData = useCallback(() => {
    dispatch(
      getProductAttributeValues({
        token: accessToken,
        attributeId: attributeId,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex]);

  const fetchProductAttributeInfoData = useCallback(async () => {
    await productAttributeServices
      .getProductAttributeInfo(accessToken, attributeId)
      .then((res) => {
        setProductAttributeInfo({ ...res });
        setProductAttributeName(res.name);
      })
      .catch((error) => {
        message.error(error?.response?.data);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateProductAttributeInfo = async () => {
    await productAttributeServices
      .updateProductAttribute(accessToken, {
        id: attributeId,
        name: productAttributeName,
      } as ProductAttributeUpdate)
      .then(() => {
        fetchProductAttributeInfoData();
      })
      .catch((error) => {
        // message.error(error?.response?.data);
      });
  };

  useEffect(() => {
    if (productAttributeName !== undefined) {
      if (productAttributeName !== productAttributeInfo?.name) {
        setIsChanged(true);
      } else {
        setIsChanged(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productAttributeName, productAttributeInfo?.name]);

  useEffect(() => {
    fetchProductAttributeValueData();
    fetchProductAttributeInfoData();
  }, [fetchProductAttributeValueData, fetchProductAttributeInfoData]);
  return (
    <AntdLayoutNoSSR
      content={
        <>
          <BreadcrumbComponent itemBreadcrumbs={itemBrs} />
          <FlexButtons
            isChanged={isChanged}
            onSave={updateProductAttributeInfo}
            onReload={fetchProductAttributeInfoData}
          />
          <Form.Item
            label={
              <p style={{ fontSize: "14px", fontWeight: "500" }}>
                Attribute Name
              </p>
            }
          >
            <Input
              placeholder="Attribute Name"
              variant="filled"
              value={productAttributeName}
              onChange={handleInputNameChange}
            />
          </Form.Item>
          <Tabs
            type="card"
            items={[
              {
                label: `Attribute Values`,
                key: attributeId,
                children: (
                  <>
                    <ProductAttributeValueTable
                      accessToken={accessToken}
                      attributeId={attributeId}
                    />
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
                  </>
                ),
              },
            ]}
          />
        </>
      }
    />
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const session = await getSession(context);
  const attributeId = context.query.attributeId!;
  const accessToken = session?.user?.access_token!;
  const itemBrs = handleBreadCumb(context.resolvedUrl);
  return {
    props: {
      attributeId: attributeId.toString(),
      accessToken: accessToken?.toString(),
      itemBrs: itemBrs,
    },
  };
};
export default AttributeInfoPage;
