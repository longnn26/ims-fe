import React, { useRef, useState } from "react";
import { Button, Input, Modal } from "antd";
import { Form } from "antd";
import { RackCreateModel } from "@models/rack";
const { confirm } = Modal;

interface Props {
  open: boolean;
  onClose: () => void;
  // loadingSubmit: boolean;
  onSubmit: (data: RackCreateModel) => void;
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
        title={<span className="inline-block m-auto">Create rack</span>}
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
                      id: form.getFieldValue("id"),
                      maxPower: form.getFieldValue("maxPower"),
                      currentPower: form.getFieldValue("currentPower"),
                      column: form.getFieldValue("column"),
                      row: form.getFieldValue("row"),
                      size: form.getFieldValue("size"),
                      areaId: form.getFieldValue("areaId"),
                    } as RackCreateModel);
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
              name="maxPower"
              label="Max Power"
              rules={[{ required: true }]}
            >
              <Input placeholder="Max Power" allowClear />
            </Form.Item>
            <Form.Item
              name="currentPower"
              label="Current Power"
              rules={[{ required: true }]}
            >
              <Input placeholder="Current Power" allowClear />
            </Form.Item>
            <Form.Item
              name="column"
              label="Column"
              rules={[{ required: true }]}
            >
              <Input placeholder="Column" allowClear />
            </Form.Item>
            <Form.Item name="row" label="Row" rules={[{ required: true }]}>
              <Input placeholder="RÏow" allowClear />
            </Form.Item>
            <Form.Item name="size" label="Size" rules={[{ required: true }]}>
              <Input placeholder="SÏize" allowClear />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ModalCreate;
