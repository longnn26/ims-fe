"use client";
import CreateButton from "@components/button/CreateButton";
import ProductCategoryTable from "@components/product-categories/ProductCategoryTable";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import { ProductCategoryCreate } from "@models/productCategory";
import { getProductCategories, setPageIndex } from "@slices/productCategory";
import { Form, Input, message, Modal, Pagination, Select } from "antd";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useState } from "react";
import productCategoryServices from "@services/productCategory";
import productRemovalServices from "@services/productRemoval";
import { OptionType } from "@models/base";
const { Option } = Select;

interface Props {
  accessToken: string;
}
const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});

const ProductCategories: React.FC<Props> = (props) => {
  const dispatch = useDispatch();
  const { accessToken } = props;
  const { data, pageIndex, pageSize, totalPage } = useSelector(
    (state) => state.productCategory
  );
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<OptionType[]>([]);
  const onCreate = async (data: ProductCategoryCreate) => {
    await productCategoryServices
      .createProductCategory(accessToken, data)
      .then(() => {
        fetchData();
      })
      .catch((error) => {
        message.error(error?.response?.data);
      });
    setOpen(false);
  };
  const fetchData = useCallback(() => {
    dispatch(
      getProductCategories({
        token: accessToken,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex]);

  const fetchForSelect = async () => {
    await productRemovalServices
      .getForSelect(accessToken)
      .then((res) => {
        const options: OptionType[] = res.map((item) => ({
          value: item.id,
          label: item.name,
        })) as any;
        setOptions(options);
      })
      .catch((error) => {
        message.error(error?.response?.data);
      });
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchForSelect();
  }, []);
  return (
    <AntdLayoutNoSSR
      content={
        <>
          <div className="mb-3">
            <CreateButton onSave={() => setOpen(true)} />
          </div>
          <ProductCategoryTable accessToken={accessToken} />
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
          <Modal
            open={open}
            title="New Product Category"
            okText="Create"
            cancelText="Cancel"
            okButtonProps={{ autoFocus: true, htmlType: "submit" }}
            onCancel={() => setOpen(false)}
            destroyOnClose
            modalRender={(dom) => (
              <Form
                layout="vertical"
                name="form_in_modal"
                initialValues={{ modifier: "public" }}
                clearOnDestroy
                onFinish={(values) => onCreate(values)}
              >
                {dom}
              </Form>
            )}
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[
                {
                  required: true,
                  message: "Please input the name of Product Category!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="removalStrategyId"
              label={
                <p style={{ fontSize: "14px", fontWeight: "500" }}>
                  Force Removal Strategy
                </p>
              }
              rules={[
                {
                  required: true,
                  message: "Please select Force Removal Strategy!",
                },
              ]}
            >
              <Select style={{ width: "100%" }} variant="filled">
                {options.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Modal>
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
export default ProductCategories;
