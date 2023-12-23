import React, { useRef, useState } from "react";
import { Button, Input, Modal, Select, Space, Card } from "antd";
import { Form } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import useSelector from "@hooks/use-selector";
import { RequestHostCreateModel } from "@models/requestHost";
const { Option } = Select;
const { confirm } = Modal;

interface Props {
  open: boolean;
  onClose: () => void;
  // loadingSubmit: boolean;
  onSubmit: (saCreateModel: RequestHostCreateModel) => void;
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

  const [requestType, setRequestType] = useState<string | undefined>(undefined);

  const handleRequestTypeChange = (value: string) => {
    setRequestType(value);
  };

  return (
    <>
      <Modal
        title={
          <span className="inline-block m-auto">Create Request Upgrade</span>
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
                      type: form.getFieldValue("type"),
                      quantity: form.getFieldValue("quantity"),
                      capacities: form.getFieldValue("capacities"),
                      note: form.getFieldValue("note"),
                      isRemoval: false,
                    } as RequestHostCreateModel;
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
              name="type"
              label="Request Type"
              rules={[
                { required: true, message: "Please select a component." },
              ]}
            >
              <Select
                placeholder="Choose Request Type"
                allowClear
                onChange={handleRequestTypeChange}
              >
                <Option value="Additional">Additional</Option>
                <Option value="Port">Port</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="quantity"
              label="Quantity IP"
              rules={[
                {
                  required: true,
                },
                {
                  pattern: new RegExp(/^[0-9]+$/),
                  message: "Quantity IP must be a number",
                },
              ]}
            >
              <Input placeholder="Quantity IP" allowClear />
            </Form.Item>
            {form.getFieldValue("type") === "Port" && (
              <Form.Item
                name="capacities"
                label="Capacity"
                rules={[
                  {
                    required: true,
                  },
                  {
                    pattern: new RegExp(/^[0-9]+$/),
                    message: "Quantity IP must be a number",
                  },
                ]}
              >
                <Input placeholder="Quantity IP" allowClear />
              </Form.Item>
            )}
            <Form.Item name="note" label="Note">
              <Input placeholder="Note" allowClear />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ModalCreate;
