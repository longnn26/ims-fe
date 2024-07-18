"use client";
import { useCallback, useEffect, useState } from "react";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import { getUomCategories, setPageIndex } from "@slices/uomCategory";
import dynamic from "next/dynamic";
import React from "react";
import { getSession } from "next-auth/react";
import UomCategoryTable from "@components/units-of-measure/UomCategoryTable";
import { Form, Input, message, Modal, Pagination } from "antd";
import { GetServerSideProps } from "next";
import CreateButton from "@components/button/CreateButton";
import { UomCategoryCreate } from "@models/uomCategory";
import uomCategoryServices from "@services/uomCategory";

interface Props {
  accessToken: string;
}
const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});

const UnitsOfMeasure: React.FC<Props> = (props) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const { accessToken } = props;
  const { data, pageIndex, pageSize, totalPage } = useSelector(
    (state) => state.uomCategory
  );
  const onCreate = async (data: UomCategoryCreate) => {
    await uomCategoryServices
      .createUomCategory(accessToken, data)
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
          <div className="mb-3">
            <CreateButton onSave={() => setOpen(true)} />
          </div>
          <UomCategoryTable accessToken={accessToken} />
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
            title="New Unit of Measure Category"
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

export default UnitsOfMeasure;
