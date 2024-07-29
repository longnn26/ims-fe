"use client";
import BreadcrumbComponent from "@components/breadcrumb/BreadcrumbComponent";
import ProductVariantTable from "@components/product/ProductVariantTable";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import {
  getProductVariants,
  resetData,
  setPageIndex,
} from "@slices/productProduct";
import { handleBreadCumb } from "@utils/helpers";
import {
  Avatar,
  Button,
  Divider,
  List,
  Modal,
  Pagination,
  Popconfirm,
  Space,
  Tag,
} from "antd";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useState } from "react";
import productTemplateServices from "@services/productTemplate";
import {
  ProductVariantCreate,
  SuggestProductVariant,
} from "@models/productTemplate";
import { PiComputerTowerBold, PiTreeStructureFill } from "react-icons/pi";
import VirtualList from "rc-virtual-list";
import { AiFillFileAdd } from "react-icons/ai";
import { useRouter } from "next/router";

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});

interface Props {
  productId: string;
  accessToken: string;
  itemBrs: ItemType[];
}

const ProductVariants: React.FC<Props> = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { productId, accessToken, itemBrs } = props;
  const { data, pageIndex, pageSize, totalPage } = useSelector(
    (state) => state.productProduct
  );
  const [suggestProductVariants, setSuggestProductVariants] =
    useState<SuggestProductVariant[][]>();
  const [openSuggest, setOpenSuggest] = useState(false);

  const fetchProductVariantsData = useCallback(() => {
    dispatch(
      getProductVariants({
        token: accessToken,
        productTmplId: productId,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex]);

  const fetchSuggestProductVariants = async () => {
    await productTemplateServices
      .suggestProductVariants(accessToken, productId)
      .then((res) => {
        setSuggestProductVariants(res);
      })
      .catch((error) => {
        // message.error(error?.response?.data);
      });
  };

  const createProductVariant = async (ptavIds: string[]) => {
    await productTemplateServices
      .createProductVariant(accessToken, {
        productTemplateId: productId,
        ptavIds: ptavIds,
      } as ProductVariantCreate)
      .then(() => {
        fetchSuggestProductVariants();
        fetchProductVariantsData();
        setOpenSuggest(false);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    fetchProductVariantsData();
  }, [fetchProductVariantsData]);

  useEffect(() => {
    fetchSuggestProductVariants();
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
          <BreadcrumbComponent
            accessToken={accessToken}
            itemBreadcrumbs={itemBrs}
          />
          <Divider orientation="left" orientationMargin="0">
            Product Variants
          </Divider>
          <div className="flex justify-start mt-5 mb-5">
            <Button
              shape="default"
              icon={<PiComputerTowerBold />}
              onClick={() => {
                setOpenSuggest(true);
                fetchSuggestProductVariants();
              }}
            >
              {`Compute Variants (${suggestProductVariants?.length})`}
            </Button>
          </div>
          <ProductVariantTable
            productTmplId={productId}
            accessToken={accessToken}
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
          <Modal
            open={openSuggest}
            okButtonProps={{
              autoFocus: true,
              htmlType: "submit",
            }}
            title={`Suggest Variants (${suggestProductVariants?.length})`}
            onCancel={() => {
              setOpenSuggest(false);
            }}
            onOk={() => {
              setOpenSuggest(false);
            }}
            destroyOnClose
          >
            <List>
              {suggestProductVariants?.map((item, index) => (
                <List.Item key={index}>
                  <List.Item.Meta
                    key={index}
                    avatar={<Avatar icon={<PiTreeStructureFill />} />}
                    title={item.map((_, i) => (
                      <Tag key={i}>
                        {`${_.attributeName}: ${_.attributeValue}`}
                      </Tag>
                    ))}
                  />
                  <Popconfirm
                    title="Sure to add?"
                    onConfirm={() =>
                      createProductVariant(
                        item.map((_) => _.productTemplateAttributeValueId)
                      )
                    }
                  >
                    <Button
                      icon={<AiFillFileAdd className="cursor-pointer" />}
                    ></Button>
                  </Popconfirm>
                </List.Item>
              ))}
            </List>
          </Modal>
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

export default ProductVariants;
