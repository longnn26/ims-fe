"use client";
import { useCallback, useEffect } from "react";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import { getUomCategories, setPageIndex } from "@slices/uomCategory";
import dynamic from "next/dynamic";
import React from "react";
import { useSession } from "next-auth/react";
import UnitsOfMeasureTable from "@components/units-of-measure/UnitsOfMeasureTable";
import { Pagination } from "antd";

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});

const UnitsOfMeasure: React.FC = () => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const { uomCategoryData, pageIndex, pageSize, totalSize } = useSelector(
    (state) => state.uomCategory
  );

  //function handle
  const fetchData = useCallback(() => {
    if (session) {
      dispatch(
        getUomCategories({
          token: session.user.access_token!,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <AntdLayoutNoSSR
      content={
        <>
          <UnitsOfMeasureTable />
          {uomCategoryData.length > 0 && (
            <Pagination
              className="text-end m-4"
              current={pageIndex}
              pageSize={pageSize ?? 10}
              total={totalSize ?? 30}
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

export default UnitsOfMeasure;
