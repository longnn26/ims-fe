"use client";
import { useCallback, useEffect, useState } from "react";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import { getUomUoms, setPageIndex } from "@slices/uomUom";
import dynamic from "next/dynamic";
import React from "react";
import { getSession } from "next-auth/react";
import UomUomTable from "@components/units-of-measure/UomUomTable";
import {
  Button,
  Flex,
  Form,
  Input,
  Pagination,
  Tabs,
  Tooltip,
  message,
} from "antd";
import { IoCloudUpload } from "react-icons/io5";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { UomCategoryInfo, UomCategoryUpdateInfo } from "@models/uomCategory";
import uomCategoryServices from "@services/uomCategory";
import { handleBreadCumb } from "@utils/helpers";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import BreadcrumbComponent from "@components/breadcrumb/BreadcrumbComponent";
import FlexButtons from "@components/button/FlexButtons";

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});
interface Props {
  uomCategoryId: string;
  accessToken: string;
  itemBrs: ItemType[];
}
const UnitsOfMeasureInfo: React.FC<Props> = (props) => {
  const router = useRouter();
  const { uomCategoryId, accessToken, itemBrs } = props;
  const dispatch = useDispatch();
  const { data, pageIndex, pageSize, totalPage } = useSelector(
    (state) => state.uomUom
  );
  const [uomCategoryInfo, setUomCategoryInfo] = useState<UomCategoryInfo>();
  const [uomCategoryName, setUomCategoryName] = useState<string | undefined>(
    undefined
  );
  const [isChanged, setIsChanged] = useState(false);

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
      .catch((error) => {
        message.error(error?.response?.data);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateUomCategoryInfo = async () => {
    await uomCategoryServices
      .updateUomCategoryInfo(accessToken, {
        id: uomCategoryId,
        name: uomCategoryName,
      } as UomCategoryUpdateInfo)
      .then(() => {
        fetchUomCategoryInfoData();
      })
      .catch((error) => {
        // message.error(error?.response?.data);
      });
  };

  useEffect(() => {
    if (uomCategoryName !== undefined) {
      if (uomCategoryName !== uomCategoryInfo?.name) {
        setIsChanged(true);
      } else {
        setIsChanged(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uomCategoryName, uomCategoryInfo?.name]);

  useEffect(() => {
    fetchUomUomsData();
    fetchUomCategoryInfoData();
  }, [fetchUomUomsData, fetchUomCategoryInfoData]);

  return (
    <AntdLayoutNoSSR
      content={
        <>
          <BreadcrumbComponent itemBreadcrumbs={itemBrs} />
          <FlexButtons
            isChanged={isChanged}
            onSave={updateUomCategoryInfo}
            onReload={fetchUomCategoryInfoData}
          />
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
                    <UomUomTable accessToken={accessToken} />
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
  const itemBrs = handleBreadCumb(context.resolvedUrl);
  return {
    props: {
      uomCategoryId: uomCategoryId.toString(),
      accessToken: accessToken?.toString(),
      itemBrs: itemBrs,
    },
  };
};

export default UnitsOfMeasureInfo;
