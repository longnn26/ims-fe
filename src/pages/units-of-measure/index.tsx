"use client";
import { useCallback, useEffect } from "react";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import { getUomCategories, setPageIndex } from "@slices/uomCategory";
import dynamic from "next/dynamic";
import React from "react";
import { getSession, useSession } from "next-auth/react";
import UomCategoryTable from "@components/units-of-measure/UomCategoryTable";
import { Pagination } from "antd";
import { GetServerSideProps } from "next";

interface Props {
  accessToken: string;
}
const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});

const UnitsOfMeasure: React.FC<Props> = (props) => {
  const dispatch = useDispatch();
  const { accessToken } = props;
  const { data, pageIndex, pageSize, totalPage } = useSelector(
    (state) => state.uomCategory
  );

  //function handle
  const fetchData = useCallback(() => {
    dispatch(
      getUomCategories({
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
          <UomCategoryTable />
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

export default UnitsOfMeasure;
