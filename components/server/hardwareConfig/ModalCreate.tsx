import React, { useRef, useState } from "react";
import { Button, Input, Modal, Select, Space, Card } from "antd";
import { Form } from "antd";
import { CloseOutlined } from '@ant-design/icons';
import { SHCCreateModel } from "@models/serverHardwareConfig";
import useSelector from "@hooks/use-selector";
const { Option } = Select;
const { confirm } = Modal;

interface Props {
  open: boolean;
  onClose: () => void;
  // loadingSubmit: boolean;
  onSubmit: (saCreateModel: SHCCreateModel) => void;
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
          <span className="inline-block m-auto">Add Hardware Information</span>
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
                    //đợi api ròi sửa khúc submit
                    const formData = {
                      descriptions: form.getFieldValue('descriptions').map((item, index) => ({
                        serialNumber: form.getFieldValue(['descriptions', index, 'serialNumber']),
                        model: form.getFieldValue(['descriptions', index, 'model']),
                        capacity: form.getFieldValue(['descriptions', index, 'capacity']),
                        description: form.getFieldValue(['descriptions', index, 'description']),
                      })),
                      componentId: form.getFieldValue('component').value,
                    } as SHCCreateModel;

                    // Call the provided onSubmit function with the formData
                    onSubmit(formData);
                  },
                  onCancel() { },
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
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            style={{ width: "100%" }}
            name="dynamic_form_complex"
          >
            <Form.Item
              name="cpu"
              label="CPU"
              labelAlign="left"
              rules={[{ required: true, min: 8, max: 255 }]}
            >
              <Input.TextArea
                placeholder="CPU"
                autoSize={{minRows: 1, maxRows: 6}}
                allowClear
              />
            </Form.Item>
            <Form.Item
              name="ram"
              labelAlign="left"
              label="Memory"
              rules={[{ required: true, min: 8, max: 255 }]}
            >
              <Input.TextArea
                placeholder="Memory"
                autoSize={{minRows: 1, maxRows: 6}}
                allowClear
              />
            </Form.Item>
            <Form.Item
              name="harddisk"
              labelAlign="left"
              label="Storage"
              rules={[{ required: true, min: 8, max: 255 }]}
            >
              <Input.TextArea
                placeholder="Storage"
                autoSize={{minRows: 1, maxRows: 6}}
                allowClear
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ModalCreate;
