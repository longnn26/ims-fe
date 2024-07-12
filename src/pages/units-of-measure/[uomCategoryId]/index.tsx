"use client";
import { useCallback, useEffect, useState } from "react";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import { getUomUoms, setPageIndex } from "@slices/uomUom";
import dynamic from "next/dynamic";
import React from "react";
import { getSession, useSession } from "next-auth/react";
import UomUomTable from "@components/units-of-measure/UomUomTable";
import {
  Descriptions,
  Flex,
  Form,
  Input,
  Pagination,
  Tabs,
  Typography,
} from "antd";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { UomCategoryInfo } from "@models/uomCategory";
import uomCategoryServices from "@services/uomCategory";

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});
interface Props {
  uomCategoryId: string;
  accessToken: string;
}
const UnitsOfMeasureInfo: React.FC<Props> = (props) => {
  const router = useRouter();
  const { uomCategoryId, accessToken } = props;
  const dispatch = useDispatch();
  const { data, pageIndex, pageSize, totalPage } = useSelector(
    (state) => state.uomUom
  );
  const [uomCategoryInfo, setUomCategoryInfo] = useState<UomCategoryInfo>();
  const [uomCategoryName, setUomCategoryName] = useState<string>();

  const handleInputNameChange = (event) => {
    setUomCategoryName(event.target.value);
  };
  const test = () => {};

  //function handle
  const fetchUomUomsData = useCallback(() => {
    dispatch(
      getUomUoms({
        token: accessToken,
        uomCategoryId: uomCategoryId,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex]);

  const fetchUomCategoryInfoData = useCallback(async () => {
    await uomCategoryServices
      .getUomCategoryInfo(accessToken, uomCategoryId)
      .then((res) => {
        setUomCategoryInfo({ ...res });
        setUomCategoryName(res.name);
      })
      .catch((error) => console.log(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchUomUomsData();
    fetchUomCategoryInfoData();
  }, [fetchUomUomsData, fetchUomCategoryInfoData]);

  return (
    <AntdLayoutNoSSR
      content={
        <>
          <Form.Item
            label={
              <p style={{ fontSize: "14px", fontWeight: "500" }}>
                Unit of Measure Category
              </p>
            }
          >
            <Input
              placeholder="Unit of Measure Category"
              variant="filled"
              value={uomCategoryName}
              onChange={handleInputNameChange}
            />
          </Form.Item>
          <Tabs
            type="card"
            items={[
              {
                label: `Units of Measure`,
                key: uomCategoryId,
                children: (
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
                ),
              },
            ]}
          />
        </>
      }
    />
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const session = await getSession(context);
  const uomCategoryId = context.query.uomCategoryId!;
  const accessToken = session?.user?.access_token!;
  return {
    props: {
      uomCategoryId: uomCategoryId.toString(),
      accessToken: accessToken?.toString(),
    },
  };
};

export default UnitsOfMeasureInfo;
