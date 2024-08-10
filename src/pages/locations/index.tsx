"use client";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect } from "react";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import {
  getStockLocations,
  setPageIndex,
  setSearchText,
  setPageSize,
} from "@slices/stockLocation";
import StockLocationTable from "@components/stockLocation/StockLocationTable";
import { Divider, Input, Pagination } from "antd";
import { useRouter } from "next/router";
import { FaSearch } from "react-icons/fa";
import CreateButton from "@components/button/CreateButton";

interface Props {
  accessToken: string;
}
const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});

const Locations: React.FC<Props> = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { accessToken } = props;
  const { data, pageIndex, pageSize, totalPage, totalSize, searchText } =
    useSelector((state) => state.stockLocation);

  const fetchData = useCallback(() => {
    dispatch(
      getStockLocations({
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
          <div className="flex justify-center">
            <Input
              className="input-search"
              prefix={<FaSearch />}
              placeholder="Search Location"
              defaultValue={searchText}
              onPressEnter={(event) => {
                dispatch(setSearchText(event.target["value"]));
              }}
            />
          </div>
          <Divider orientation="left" orientationMargin="0">
            Location List
          </Divider>
          <div className="mt-3 mb-3">
            <CreateButton onSave={() => router.push(`/locations/new`)} />
          </div>
          <StockLocationTable accessToken={accessToken} />
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

export default Locations;
