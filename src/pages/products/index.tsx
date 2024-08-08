"use client";
import CreateButton from "@components/button/CreateButton";
import ProductTemplateKanban from "@components/product/ProductTemplateKanban";
import ProductTemplateTable from "@components/product/ProductTemplateTable";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import {
  getProductTemplates,
  setPageIndex,
  setPageSize,
  setSearchText,
} from "@slices/productTemplate";
import { Button, Divider, Input, Pagination, Tooltip } from "antd";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { PiKanbanFill } from "react-icons/pi";
import { FaListUl } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

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
  const { data, pageIndex, pageSize, totalSize, searchText } = useSelector(
    (state) => state.productTemplate
  );
  const [viewKanban, setViewKanban] = useState<boolean>(true);

  const fetchData = useCallback(() => {
    dispatch(
      getProductTemplates({
        token: accessToken,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize, searchText]);
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
          <Divider orientation="left" orientationMargin="0">
            Product List
          </Divider>
          <div className="flex justify-center">
            <Input
              className="input-search"
              prefix={<FaSearch />}
              placeholder="Search Reference"
              defaultValue={searchText}
              onPressEnter={(event) => {
                dispatch(setSearchText(event.target["value"]));
              }}
            />
          </div>
          <div className="mb-2 h-9 flex justify-end">
            <Tooltip title="Kanban">
              <Button
                type={`${viewKanban ? "primary" : "default"}`}
                icon={<PiKanbanFill />}
                onClick={() => setViewKanban(true)}
              />
            </Tooltip>
            <Tooltip title="List">
              <Button
                type={`${!viewKanban ? "primary" : "default"}`}
                icon={<FaListUl />}
                onClick={() => setViewKanban(false)}
              />
            </Tooltip>
          </div>
          {viewKanban ? (
            <ProductTemplateKanban accessToken={accessToken} />
          ) : (
            <ProductTemplateTable accessToken={accessToken} />
          )}
          {data?.length > 0 && (
            <Pagination
              className="text-end m-4"
              current={pageIndex}
              pageSize={pageSize}
              total={totalSize}
              showSizeChanger
              onShowSizeChange={(current, pageSize) => {
                dispatch(setPageSize(pageSize));
              }}
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
