import { useCallback, useEffect } from "react";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import { getUomUoms, setPageIndex } from "@slices/uomUom";
import dynamic from "next/dynamic";
import React from "react";
import { useSession } from "next-auth/react";
import UomUomTable from "@components/units-of-measure/UomUomTable";
import { Pagination } from "antd";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});
interface Props {
  uomCategoryId: string;
}
const UnitsOfMeasureInfo: React.FC<Props> = (props) => {
  const router = useRouter();
  const { uomCategoryId } = props;
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const { data, pageIndex, pageSize, totalPage } = useSelector(
    (state) => state.uomUom
  );

  //function handle
  const fetchData = useCallback(() => {
    if (session && uomCategoryId) {
      dispatch(
        getUomUoms({
          token: session.user.access_token!,
          uomCategoryId: uomCategoryId,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex]);

  useEffect(() => {
    console.log(uomCategoryId);
    // fetchData();
    if (session && uomCategoryId) {
      dispatch(
        getUomUoms({
          token: session.user.access_token!,
          uomCategoryId: uomCategoryId,
        })
      );
    }
  }, [uomCategoryId]);

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

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const uomCategoryId = context.query.uomCategoryId!;
  return {
    props: {
      uomCategoryId: uomCategoryId.toString(),
    },
  };
};

export default UnitsOfMeasureInfo;
