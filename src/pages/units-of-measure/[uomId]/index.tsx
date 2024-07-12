"use client";
import { useCallback, useEffect } from "react";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import { getUomUoms, setPageIndex } from "@slices/uomUom";
import dynamic from "next/dynamic";
import React from "react";
import { useSession } from "next-auth/react";
import UomUomTable from "@components/units-of-measure/UomUomTable";
import { Pagination } from "antd";

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});

const UnitsOfMeasureInfo: React.FC = () => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const { data, pageIndex, pageSize, totalPage } = useSelector(
    (state) => state.uomUom
  );

  //function handle
  const fetchData = useCallback(() => {
    if (session) {
      dispatch(
        getUomUoms({
          token: session.user.access_token!,
          uomCategoryId: '1e6da5f5-b75f-4b48-a875-5b0232870ae4'
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
          <UomUomTable />
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

export default UnitsOfMeasureInfo;
