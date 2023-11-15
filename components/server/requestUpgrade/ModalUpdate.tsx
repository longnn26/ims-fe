import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Modal, Select } from "antd";
import { Form } from "antd";
import {
  RequestUpgradeUpdateModel,
  RequestUpgrade,
} from "@models/requestUpgrade";
import { optionStatus } from "@utils/constants";
const { confirm } = Modal;

interface Props {
  requestUpgrade: RequestUpgrade;
  onClose: () => void;
  onSubmit: (saCreateModel: RequestUpgradeUpdateModel) => void;
}

const ModalUpdate: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { onSubmit, requestUpgrade, onClose } = props;

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

  const setFieldsValueInitial = () => {
    if (formRef.current)
      form.setFieldsValue({
        id: requestUpgrade.id,
        description: requestUpgrade.description,
        capacity: requestUpgrade.capacity,
        componentId: requestUpgrade.componentId,
        serverAllocationId: requestUpgrade.serverAllocationId,
      });
  };

  useEffect(() => {
    // refresh after submit for fileList
    if (requestUpgrade) {
      setFieldsValueInitial();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestUpgrade]);

  return (
    <>
      <Modal
        title={
          <span className="inline-block m-auto">Update hardware config</span>
        }
        open={Boolean(requestUpgrade)}
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
                      componentId: form.getFieldValue("componentId"),
                      serverAllocationId:
                        form.getFieldValue("serverAllocationId"),
                      description: form.getFieldValue("description"),
                      capacity: form.getFieldValue("capacity"),
                    } as RequestUpgradeUpdateModel);
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
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ModalUpdate;
