import React, { useRef, useState } from "react";
import { Button, Input, Modal, Select, Space, Card } from "antd";
import { Form } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import useSelector from "@hooks/use-selector";
import { RequestUpgradeRemoveModel } from "@models/requestUpgrade";
import { title } from "process";
const { Option } = Select;
const { confirm } = Modal;

interface Props {
  open: boolean;
  onClose: () => void;
  // loadingSubmit: boolean;
  onSubmit: (saCreateModel: RequestUpgradeRemoveModel) => void;
}

const ModalRemove: React.FC<Props> = (props) => {
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
          <span className="inline-block m-auto">
            Submit Hardware Remove Request
          </span>
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
                    const formData = {
                      descriptions: null,
                      componentId: form.getFieldValue("component").value,
                    } as RequestUpgradeRemoveModel;

                    // Call the provided onSubmit function with the formData
                    onSubmit(formData);
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
            name="dynamic_form_complex"
          >
            <Form.Item
              name="component"
              label="Component"
              rules={[
                { required: true, message: "Please select a component." },
              ]}
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
                  <Option value={l.id} label={l.name} key={index}>
                    {l.name}
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

export default ModalRemove;
