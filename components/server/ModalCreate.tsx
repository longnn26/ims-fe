import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Modal, Select } from "antd";
import { Form } from "antd";
import { SACreateModel } from "@models/serverAllocation";
import useSelector from "@hooks/use-selector";
import { ParamGet } from "@models/base";
import { Customer } from "@models/customer";
import customerService from "@services/customer";
import { useSession } from "next-auth/react";
const { confirm } = Modal;
const { Option } = Select;

interface Props {
  open: boolean;
  onClose: () => void;
  // loadingSubmit: boolean;
  onSubmit: (saCreateModel: SACreateModel) => void;
  customerParamGet?: ParamGet;
  setCustomerParamGet?: (value: ParamGet) => void;
}

const ModalCreate: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { onSubmit, open, onClose, customerParamGet, setCustomerParamGet } =
    props;
  const { data: session, update: sessionUpdate } = useSession();

  const [confirmLoading, setConfirmLoading] = useState(false);
  const { customerData } = useSelector((state) => state.serverAllocation);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pageSizeCus, setPageSizeCus] = useState<number>(6);
  const [totalPageCus, setTotalPageCus] = useState<number>(2);
  const [pageIndexCus, setPageIndexCus] = useState<number>(0);

  const disabled = async () => {
    var result = false;
    try {
      await form.validateFields();
    } catch (errorInfo) {
      result = true;
    }
    return result;
  };

  const getMoreCustomer = async () => {
    await customerService
      .getData(session?.user.access_token!, {
        PageIndex: pageIndexCus + 1,
        PageSize: pageSizeCus,
      } as ParamGet)
      .then(async (data) => {
        setTotalPageCus(data.totalPage);
        setPageIndexCus(data.pageIndex);
        setCustomers([...customers, ...data.data]);
      });
  };

  useEffect(() => {
    session && getMoreCustomer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return (
    <>
      <Modal
        title={
          <span className="inline-block m-auto">Create server allocation</span>
        }
        open={open}
        confirmLoading={confirmLoading}
        onCancel={() => {
          onClose();
          form.resetFields();
        }}
        footer={[
          <Button
            // loading={loadingSubmit}
            className="btn-submit"
            key="submit"
            onClick={async () => {
              if (!(await disabled()))
                confirm({
                  title: "Do you want to save?",
                  async onOk() {
                    onSubmit({
                      name: form.getFieldValue("name"),
                      serialNumber: form.getFieldValue("serialNumber"),
                      power: form.getFieldValue("power"),
                      note: form.getFieldValue("note"),
                      customerId: form.getFieldValue("customer").value,
                    } as SACreateModel);
                    form.resetFields();
                  },
                  onCancel() {},
                });
            }}
          >
            Submit
          </Button>,
        ]}
      >
        <div className="flex max-w-md flex-col gap-4 m-auto">
          <Form
            ref={formRef}
            form={form}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ width: "100%" }}
          >
            <Form.Item
              name="name"
              label="Server Name"
              rules={[{ required: true }]}
            >
              <Input placeholder="Server Name" allowClear />
            </Form.Item>
            <Form.Item
              name="serialNumber"
              label="Serial Number"
              rules={[{ required: true }]}
            >
              <Input placeholder="Serial Number" allowClear />
            </Form.Item>
            <Form.Item
              name="power"
              label="Power"
              rules={[
                {
                  required: true,
                },
                {
                  pattern: new RegExp(/^[0-9]+$/),
                  message: "Power must be a number",
                },
              ]}
            >
              <Input placeholder="Power" allowClear />
            </Form.Item>
            <Form.Item name="note" label="Note">
              <Input placeholder="Note" allowClear />
            </Form.Item>
            <Form.Item
              name="customer"
              label="Customer"
              labelAlign="right"
              rules={[{ required: true, message: "Customer not empty" }]}
            >
              <Select
                labelInValue
                allowClear
                listHeight={160}
                onPopupScroll={async (e: any) => {
                  const { target } = e;
                  if (
                    (target as any).scrollTop + (target as any).offsetHeight ===
                    (target as any).scrollHeight
                  ) {
                    if (pageIndexCus < totalPageCus) {
                      getMoreCustomer();
                    }
                  }
                }}
              >
                {customers.map((l, index) => (
                  <Option value={l.id} label={l?.customerName} key={index}>
                    {l.customerName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ModalCreate;
