"use client";
import StockMoveLineTable from "@components/stockQuant/StockMoveLineTable";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import { getStockMoveLines, setPageIndex } from "@slices/stockMoveLine";
import { handleBreadCumb } from "@utils/helpers";
import { Button, Divider, Pagination, Tooltip } from "antd";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useCallback, useEffect } from "react";
import { IoCaretBack } from "react-icons/io5";

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});

interface Props {
  quantityId: string;
  accessToken: string;
  itemBrs: ItemType[];
}

const MovesHistoryPage: React.FC<Props> = (props) => {
  const { quantityId, accessToken, itemBrs } = props;
  const { data, pageIndex, pageSize, totalSize } = useSelector(
    (state) => state.stockMoveLine
  );
  const router = useRouter();
  const dispatch = useDispatch();
  const fetchStockMoveLineData = useCallback(() => {
    dispatch(
      getStockMoveLines({
        token: accessToken,
        quantId: quantityId,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex]);

  useEffect(() => {
    fetchStockMoveLineData();
  }, [fetchStockMoveLineData]);
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
            Moves History
          </Divider>
          <StockMoveLineTable accessToken={accessToken} />
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
  const quantityId = context.query.quantityId!;
  const accessToken = session?.user?.access_token!;
  const itemBrs = handleBreadCumb(context.resolvedUrl);
  return {
    props: {
      quantityId: quantityId.toString(),
      accessToken: accessToken?.toString(),
      itemBrs: itemBrs,
    },
  };
};
export default MovesHistoryPage;
