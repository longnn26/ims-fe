import React, { useRef, useState } from "react";
import { Button, Input, Modal, Radio } from "antd";
import { Form } from "antd";
import { ComponentCreateModel } from "@models/component";
const { confirm } = Modal;

interface Props {
  open: boolean;
  onClose: () => void;
  // loadingSubmit: boolean;
  onSubmit: (saCreateModel: ComponentCreateModel) => void;
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
        title={<span className="inline-block m-auto">Create component</span>}
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
                      description: form.getFieldValue("description"),
                      isRequired: form.getFieldValue("isRequired"),
                    } as ComponentCreateModel);
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
              label="Name"
              rules={[{ required: true, min: 1, max: 255 }]}
            >
              <Input placeholder="Name" allowClear />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input placeholder="Description" allowClear />
            </Form.Item>
            <Form.Item
              label="Is Server Required"
              name="isRequired"
              rules={[{ required: true }]}
            >
              <Radio.Group>
                <Radio value={true}> yes </Radio>
                <Radio value={false}> No </Radio>
              </Radio.Group>
            </Form.Item>
            {/* <Form.Item name="unit" label="Unit" rules={[{ required: true }]}>
              <Input placeholder="Unit" allowClear />
            </Form.Item>
            <Form.Item name="type" label="Type" rules={[{ required: true }]}>
              <Input placeholder="Type" allowClear />
            </Form.Item> */}
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ModalCreate;
