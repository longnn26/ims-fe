import React, { useRef, useState } from "react";
import { Button, Input, Modal } from "antd";
import { Form } from "antd";
import { SACreateModel } from "@models/serverAllocation";
const { confirm } = Modal;

interface Props {
  open: boolean;
  onClose: () => void;
  // loadingSubmit: boolean;
  onSubmit: (saCreateModel: SACreateModel) => void;
}

const ModalCreate: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { onSubmit, open, onClose } = props;

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
                      customerId: form.getFieldValue("customerId"),
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
              name="customerId"
              label="Customer Id"
              labelAlign="right"
              rules={[{ required: true }]}
            >
              <Input placeholder="Customer Id" allowClear />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ModalCreate;
