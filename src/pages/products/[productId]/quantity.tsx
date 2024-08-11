"use client";
import { handleBreadCumb } from "@utils/helpers";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import BreadcrumbComponent from "@components/breadcrumb/BreadcrumbComponent";
import productTemplateServices from "@services/productTemplate";
import StockQuantTable from "@components/product/StockQuantTable";
import {
  Button,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Pagination,
  Select,
} from "antd";
import { getStockQuants, resetData, setPageIndex } from "@slices/stockQuant";
import { PiComputerTowerBold } from "react-icons/pi";
import CreateButton from "@components/button/CreateButton";
import { StockQuantCreate } from "@models/stockQuant";
import stockQuantServices from "@services/stockQuant";
import stockLocationServices from "@services/stockLocation";
import { OptionType } from "@models/base";
const { Option } = Select;

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});

interface Props {
  productId: string;
  accessToken: string;
  itemBrs: ItemType[];
}
const StockQuantPage: React.FC<Props> = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { productId, accessToken, itemBrs } = props;
  const { data, pageIndex, pageSize, totalPage } = useSelector(
    (state) => state.stockQuant
  );
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [locationOptions, setLocationOptions] = useState<OptionType[]>([]);
  const [productVariantOptions, setProductVarianOptions] = useState<
    OptionType[]
  >([]);

  const onCreate = async (data: StockQuantCreate) => {
    await stockQuantServices
      .createStockQuant(accessToken, data)
      .then(() => {
        fetchStockQuantData();
        setOpen(false);
      })
      .catch((error) => {
        message.error(error?.response?.data);
      });
  };

  const fetchStockQuantData = useCallback(() => {
    dispatch(
      getStockQuants({
        token: accessToken,
        productTmplId: productId,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex]);

  const fetchLocations = async () => {
    await stockLocationServices
      .getForSelect(accessToken)
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
    await productTemplateServices
      .getProductVariantForSelect(accessToken, productId)
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

  useEffect(() => {
    fetchLocations();
    fetchProductVariantForSelect();
  }, []);

  useEffect(() => {
    fetchStockQuantData();
  }, [fetchStockQuantData]);

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
            Stock Quantity
          </Divider>
          <div className="mt-3 mb-3">
            <CreateButton
              onSave={() => {
                setOpen(true);
              }}
            />
          </div>
          <StockQuantTable
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
            open={open}
            title="New Stock Quantity"
            okText="Create"
            cancelText="Cancel"
            okButtonProps={{ autoFocus: true, htmlType: "submit" }}
            onCancel={() => setOpen(false)}
            destroyOnClose
            modalRender={(dom) => (
              <Form
                layout="vertical"
                form={form}
                name="form_in_modal"
                initialValues={{ modifier: "public" }}
                clearOnDestroy
                onFinish={(values) => onCreate(values)}
              >
                {dom}
              </Form>
            )}
          >
            <Form.Item
              name="locationId"
              label="Location"
              rules={[
                {
                  required: true,
                  message: "Please input the Location!",
                },
              ]}
            >
              <Select style={{ width: "100%" }} variant="filled">
                {locationOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="productId"
              label="Product Variant"
              rules={[
                {
                  required: true,
                  message: "Please input the Product!",
                },
              ]}
            >
              <Select style={{ width: "100%" }} variant="filled">
                {productVariantOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="quantity"
              label="Quantity"
              rules={[
                {
                  required: true,
                  message: "Please input Quantity!",
                },
              ]}
            >
              <Input />
            </Form.Item>
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
export default StockQuantPage;
