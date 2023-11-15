import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Modal, Select } from "antd";
import { Form } from "antd";
import { CustomerUpdateModel, Customer } from "@models/customer";
import { optionStatus } from "@utils/constants";
const { confirm } = Modal;

interface Props {
  customer: Customer;
  onClose: () => void;
  onSubmit: (data: CustomerUpdateModel) => void;
}

const ModalUpdate: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { onSubmit, customer, onClose } = props;

  const [confirmLoading, setConfirmLoading] = useState(false);

  const disabled = async () => {
    var result = false;
    try {
      await form.validateFields();
    } catch (errorInfo) {
      result = true;
    }
    return result;
  };

  const setFieldsValueInitial = () => {
    if (formRef.current)
      form.setFieldsValue({
        id: customer.id,
        companyName: customer.companyName,
        address: customer.address,
        taxNumber: customer.taxNumber,
        email: customer.email,
        phoneNumber: customer.phoneNumber,
        customerName: customer.customerName,
        companyTypeId: customer.companyTypeId,
      });
  };

  useEffect(() => {
    // refresh after submit for fileList
    if (customer) {
      setFieldsValueInitial();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer]);

  return (
    <>
      <Modal
        title={<span className="inline-block m-auto">Update customer</span>}
        open={Boolean(customer)}
        confirmLoading={confirmLoading}
        onCancel={() => {
          onClose();
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
                      id: form.getFieldValue("id"),
                      companyName: form.getFieldValue("companyName"),
                      address: form.getFieldValue("address"),
                      taxNumber: form.getFieldValue("taxNumber"),
                      email: form.getFieldValue("email"),
                      phoneNumber: form.getFieldValue("phoneNumber"),
                      customerName: form.getFieldValue("customerName"),
                      companyTypeId: form.getFieldValue("companyTypeId"),
                    } as Customer);
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
              name="companyName"
              label="Company name"
              rules={[{ required: true }]}
            >
              <Input placeholder="Company name" allowClear />
            </Form.Item>
            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true }]}
            >
              <Input placeholder="Address" allowClear />
            </Form.Item>
            <Form.Item
              name="taxNumber"
              label="Tax number"
              rules={[{ required: true }]}
            >
              <Input placeholder="Tax number" allowClear />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true }]}>
              <Input placeholder="Email" allowClear />
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              label="Phone number"
              rules={[{ required: true }]}
            >
              <Input placeholder="Phone number" allowClear />
            </Form.Item>
            <Form.Item
              name="customerName"
              label="Customer name"
              rules={[{ required: true }]}
            >
              <Input placeholder="Customer name" allowClear />
            </Form.Item>
            <Form.Item
              name="companyTypeId"
              label="Company type id"
              rules={[{ required: true }]}
            >
              <Input placeholder="Company type id" allowClear />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ModalUpdate;