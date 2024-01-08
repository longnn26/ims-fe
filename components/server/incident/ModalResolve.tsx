import React, { useEffect, useRef, useState } from "react";
import { Button, DatePicker, Input, Modal, Select, Switch } from "antd";
import { Form } from "antd";

const { confirm } = Modal;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: string) => void;
}

const ModalResolve: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { onSubmit, onClose, open } = props;

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
        title={<span className="inline-block m-auto">Resolve Incident</span>}
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
                  title: "Do you want to resolve incident?",
                  async onOk() {
                    onSubmit(form.getFieldValue("solution"));
                    form.resetFields();
                    onClose();
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
              name="solution"
              label="Solution"
              rules={[{ required: true }]}
            >
              <Input placeholder="Solution" allowClear />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ModalResolve;
