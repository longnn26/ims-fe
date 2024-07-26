"use client";
import { GetServerSideProps } from "next";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import { getSession } from "next-auth/react";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getStockWarehouses, setPageIndex } from "@slices/stockWarehouse";
import StockWarehouseTable from "@components/stockWarehouse/StockWarehouseTable";
import { Form, Input, message, Modal, Pagination } from "antd";
import CreateButton from "@components/button/CreateButton";
import { StockWarehouseCreate } from "@models/stockWarehouse";
import stockWarehouseService from "@services/stockWarehouse";

interface Props {
  accessToken: string;
}
const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});

const Warehouses: React.FC<Props> = (props) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { accessToken } = props;
  const { data, pageIndex, pageSize, totalPage } = useSelector(
    (state) => state.stockWarehouse
  );
  const [open, setOpen] = useState(false);
  const onCreate = async (data: StockWarehouseCreate) => {
    await stockWarehouseService
      .createStockWarehouse(accessToken, data)
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
      getStockWarehouses({
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
          <StockWarehouseTable accessToken={accessToken} />
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
            title="New Warehouse"
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
                  message: "Please input the name of Warehouse!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="code"
              label="Code"
              rules={[
                {
                  required: true,
                  message: "Please input the code of Warehouse!",
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
export default Warehouses;
