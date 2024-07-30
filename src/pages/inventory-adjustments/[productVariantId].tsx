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
  Tooltip,
} from "antd";
import {
  getStockQuants,
  resetData,
  setPageIndex,
} from "@slices/stockQuantProduct";
import { PiComputerTowerBold } from "react-icons/pi";
import CreateButton from "@components/button/CreateButton";
import { StockQuantCreate } from "@models/stockQuant";
import stockQuantServices from "@services/stockQuant";
import stockLocationServices from "@services/stockLocation";
import { OptionType } from "@models/base";
import StockQuantProductTable from "@components/product/StockQuantProductTable";
import { IoCaretBack } from "react-icons/io5";
const { Option } = Select;

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});

interface Props {
  productVariantId: string;
  accessToken: string;
  itemBrs: ItemType[];
}
const StockQuantPage: React.FC<Props> = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { productVariantId, accessToken, itemBrs } = props;
  const { data, pageIndex, pageSize, totalPage } = useSelector(
    (state) => state.stockQuant
  );
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [internalLocationOptions, setInternalLocationOptions] = useState<
    OptionType[]
  >([]);
  const [productVariantOptions, setProductVarianOptions] = useState<
    OptionType[]
  >([]);

  const fetchStockQuantData = useCallback(() => {
    dispatch(
      getStockQuants({
        token: accessToken,
        productVariantId: productVariantId,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex]);

  const fetchInternalLocations = async () => {
    await stockLocationServices
      .getInternalLocations(accessToken)
      .then((res) => {
        const options: OptionType[] = res.map((item) => ({
          value: item.id,
          label: item.completeName,
        })) as any;
        setInternalLocationOptions(options);
      })
      .catch((error) => {
        message.error(error?.response?.data);
      });
  };

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
          <Tooltip title="Back">
            <Button
              type="primary"
              shape="round"
              icon={<IoCaretBack size={20} />}
              onClick={() => router.back()}
            />
          </Tooltip>
          <Divider orientation="left" orientationMargin="0">
            Inventory Adjustments
          </Divider>
          <StockQuantProductTable
            productVariantId={productVariantId}
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
        </>
      }
    />
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const session = await getSession(context);
  const productVariantId = context.query.productVariantId!;
  const accessToken = session?.user?.access_token!;
  const itemBrs = handleBreadCumb(context.resolvedUrl);
  return {
    props: {
      productVariantId: productVariantId.toString(),
      accessToken: accessToken?.toString(),
      itemBrs: itemBrs,
    },
  };
};
export default StockQuantPage;
