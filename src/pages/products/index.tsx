"use client";
import CreateButton from "@components/button/CreateButton";
import ProductTemplateTable from "@components/product/ProductTemplateTable";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import { getProductTemplates, setPageIndex } from "@slices/productTemplate";
import { Pagination } from "antd";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useCallback, useEffect } from "react";

interface Props {
  accessToken: string;
}
const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});

const Products: React.FC<Props> = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { accessToken } = props;
  const { data, pageIndex, pageSize, totalPage } = useSelector(
    (state) => state.productTemplate
  );
  const fetchData = useCallback(() => {
    dispatch(
      getProductTemplates({
        token: accessToken,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return (
    <AntdLayoutNoSSR
      content={
        <>
          <div className="mb-3">
            <CreateButton onSave={() => router.push(`/products/new`)} />
          </div>
          <ProductTemplateTable accessToken={accessToken} />
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
  const accessToken = session?.user?.access_token!;
  return {
    props: {
      accessToken: accessToken?.toString(),
    },
  };
};
export default Products;
