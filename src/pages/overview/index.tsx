"use client";
import { GetServerSideProps } from "next";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import { getSession } from "next-auth/react";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import {
  getStockPickingTypes,
  setPageIndex,
} from "@slices/stockPickingType";
import { Pagination } from "antd";
import StockPickingTypeKanban from "@components/stockPickingType/StockPickingTypeKanban";

interface Props {
  accessToken: string;
}
const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});

const Overview: React.FC<Props> = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { accessToken } = props;
  const { data, pageIndex, pageSize, totalPage, totalSize } = useSelector(
    (state) => state.stockPickingType
  );

  const fetchData = useCallback(() => {
    dispatch(
      getStockPickingTypes({
        token: accessToken,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // useEffect(() => {
  //   const handleRouteChange = () => {
  //     dispatch(resetState());
  //   };

  //   router.events.on("routeChangeStart", handleRouteChange);

  //   // Clean up the event listener on component unmount
  //   return () => {
  //     router.events.off("routeChangeStart", handleRouteChange);
  //   };
  // }, [router, dispatch]);
  return (
    <AntdLayoutNoSSR
      content={
        <>
          <StockPickingTypeKanban accessToken={accessToken} />
          {data?.length > 0 && (
            <Pagination
              className="text-end m-4"
              current={pageIndex}
              pageSize={pageSize}
              total={totalSize}
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
export default Overview;
