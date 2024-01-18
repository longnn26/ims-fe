import React, { useRef, useState } from "react";
import { Button, Input, Modal } from "antd";
import { Form } from "antd";
import { AreaCreateModel } from "@models/area";
const { confirm } = Modal;

interface Props {
  open: boolean;
  onClose: () => void;
  // loadingSubmit: boolean;
  onSubmit: (data: AreaCreateModel) => void;
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
        title={<span className="inline-block m-auto">Create area</span>}
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
                      rowCount: form.getFieldValue("rowCount"),
                      columnCount: form.getFieldValue("columnCount"),
                    } as AreaCreateModel);
                    form.resetFields();
                  },
                  onCancel() {},
                });
            }}
          >
            Create
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
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input placeholder="Name" allowClear />
            </Form.Item>
            <Form.Item
              name="rowCount"
              label="Row Count"
              rules={[{ required: true }]}
            >
              <Input placeholder="Row Count" allowClear />
            </Form.Item>
            <Form.Item
              name="columnCount"
              label="Column Count"
              rules={[{ required: true }]}
            >
              <Input placeholder="Column Count" allowClear />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ModalCreate;
