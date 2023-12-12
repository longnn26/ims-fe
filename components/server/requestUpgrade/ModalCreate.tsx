import React, { useRef, useState } from "react";
import { Button, Input, Modal, Select } from "antd";
import { Form } from "antd";
import { RequestUpgradeCreateModel } from "@models/requestUpgrade";
import useSelector from "@hooks/use-selector";
const { Option } = Select;
const { confirm } = Modal;

interface Props {
  open: boolean;
  onClose: () => void;
  // loadingSubmit: boolean;
  onSubmit: (data: RequestUpgradeCreateModel) => void;
}

const ModalCreate: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { onSubmit, open, onClose } = props;

  const [confirmLoading, setConfirmLoading] = useState(false);
  const { componentOptions } = useSelector((state) => state.component);

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
          <span className="inline-block m-auto">Create request upgrade</span>
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
                      information: form.getFieldValue("information"),
                      capacity: form.getFieldValue("capacity"),
                      componentId: form.getFieldValue("component").value,
                    } as RequestUpgradeCreateModel);
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
              name="information"
              label="Information"
              rules={[{ required: true }]}
            >
              <Input placeholder="Information" allowClear />
            </Form.Item>
            <Form.Item
              name="capacity"
              label="Capacity"
              rules={[
                { required: true },
                {
                  pattern: new RegExp(/^[0-9]+$/),
                  message: "Capacity must be a number greater than 0",
                },
              ]}
            >
              <Input placeholder="Capacity" allowClear />
            </Form.Item>
            <Form.Item
              name="component"
              label="Component"
              rules={[{ required: true }]}
            >
              <Select
                allowClear
                onSelect={(value, option) => {
                  form.setFieldsValue({
                    component: {
                      value: value,
                      label: option.label,
                    },
                  });
                }}
              >
                {componentOptions.map((l, index) => (
                  <Option value={l.id} label={l?.name} key={index}>
                    {`${l.name}`}
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
