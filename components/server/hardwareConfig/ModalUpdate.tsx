import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Modal, Select } from "antd";
import { Form } from "antd";
import {
  SHCUpdateModel,
  ServerHardwareConfig,
} from "@models/serverHardwareConfig";
import useSelector from "@hooks/use-selector";
const { Option } = Select;
const { confirm } = Modal;

interface Props {
  serverHardwareConfig: ServerHardwareConfig;
  onClose: () => void;
  onSubmit: (saCreateModel: SHCUpdateModel) => void;
}

const ModalUpdate: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { onSubmit, serverHardwareConfig, onClose } = props;

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

  const setFieldsValueInitial = () => {
    var component = componentOptions.find(
      (_) => _.id === serverHardwareConfig.componentId
    );
    if (formRef.current)
      form.setFieldsValue({
        id: serverHardwareConfig.id,
        description: serverHardwareConfig.description,
        capacity: serverHardwareConfig.capacity,
        component: component
          ? {
              value: component?.id!,
              label: component.name!,
            }
          : undefined,
        serverAllocationId: serverHardwareConfig.serverAllocationId,
      });
  };

  useEffect(() => {
    // refresh after submit for fileList
    if (serverHardwareConfig) {
      setFieldsValueInitial();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverHardwareConfig]);

  return (
    <>
      <Modal
        title={
          <span className="inline-block m-auto">Update hardware config</span>
        }
        open={Boolean(serverHardwareConfig)}
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
                      componentId:
                        form.getFieldValue("component").value ||
                        form.getFieldValue("component"),
                      serverAllocationId:
                        form.getFieldValue("serverAllocationId"),
                      description: form.getFieldValue("description"),
                      capacity: form.getFieldValue("capacity"),
                    } as SHCUpdateModel);
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
              name="description"
              label="Description"
              // rules={[{ required: true }]}
            >
              <Input placeholder="Description" allowClear />
            </Form.Item>
            <Form.Item
              name="capacity"
              label="Capacity"
              rules={[{ required: true }]}
            >
              <Input placeholder="Capacity" allowClear />
            </Form.Item>
            <Form.Item
              name="component"
              label="Component"
              rules={[{ required: true }]}
            >
              <Select allowClear>
                {componentOptions.map((l, index) => (
                  <Option value={l.id} label={l?.name} key={index}>
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

export default ModalUpdate;
