"use client";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useState } from "react";
import useSelector from "@hooks/use-selector";
import useDispatch from "@hooks/use-dispatch";
import { getProductAttributes, setPageIndex } from "@slices/productAttribute";
import { Form, Input, message, Modal, Pagination } from "antd";
import ProductAttributeTable from "@components/attributes/ProductAttributeTable";
import { ProductAttributeCreate } from "@models/productAttribute";
import productAttributeServices from "@services/productAttribute";
import CreateButton from "@components/button/CreateButton";

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});
interface Props {
  accessToken: string;
}
const Attributes: React.FC<Props> = (props) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const { accessToken } = props;
  const { data, pageIndex, pageSize, totalPage } = useSelector(
    (state) => state.productAttribute
  );

  const onCreate = async (data: ProductAttributeCreate) => {
    await productAttributeServices
      .createProductAttribute(accessToken, data)
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
      getProductAttributes({
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
          <div className="mb-3">
            <CreateButton onSave={() => setOpen(true)} />
          </div>
          <ProductAttributeTable accessToken={accessToken} />
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
            title="New Attribute"
            okText="Create"
            cancelText="Cancel"
            okButtonProps={{ autoFocus: true, htmlType: "submit" }}
            onCancel={() => setOpen(false)}
            destroyOnClose
            modalRender={(dom) => (
              <Form
                layout="vertical"
                form={form}
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
                  message: "Please input the name of Unit of Measure Category!",
                },
              ]}
            >
              <Input />
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
export default Attributes;
