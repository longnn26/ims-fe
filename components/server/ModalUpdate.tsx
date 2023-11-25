import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Modal, Select } from "antd";
import { Form } from "antd";
import { SAUpdateModel, ServerAllocation } from "@models/serverAllocation";
import { optionStatus, serverAllocationStatus } from "@utils/constants";
const { confirm } = Modal;

interface Props {
  serverAllocation: ServerAllocation;
  onClose: () => void;
  onSubmit: (saCreateModel: SAUpdateModel) => void;
}

const ModalUpdate: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { onSubmit, serverAllocation, onClose } = props;

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
        id: serverAllocation.id,
        name: serverAllocation.name,
        power: serverAllocation.power,
        note: serverAllocation.note,
        status: serverAllocation?.status
          ? {
              value: serverAllocation?.status,
              label: serverAllocation?.status,
            }
          : undefined,
      });
  };

  useEffect(() => {
    // refresh after submit for fileList
    if (serverAllocation) {
      setFieldsValueInitial();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverAllocation]);

  return (
    <>
      <Modal
        title={
          <span className="inline-block m-auto">Update server allocation</span>
        }
        open={Boolean(serverAllocation)}
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
                      name: form.getFieldValue("name"),
                      power: form.getFieldValue("power"),
                      note: form.getFieldValue("note"),
                    } as SAUpdateModel);
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
              label="Server Name"
              rules={[{ required: true }]}
            >
              <Input placeholder="Server Name" allowClear />
            </Form.Item>
            <Form.Item
              name="power"
              label="Power"
              rules={[
                {
                  required: true,
                },
                {
                  pattern: new RegExp(/^[0-9]+$/),
                  message: "Power must be a number",
                },
              ]}
            >
              <Input placeholder="Power" allowClear />
            </Form.Item>
            <Form.Item name="note" label="Note">
              <Input placeholder="Note" allowClear />
            </Form.Item>
            <Form.Item
              name="status"
              label="Status"
              labelAlign="right"
              rules={[{ required: true, message: "Status not empty" }]}
            >
              <Select labelInValue allowClear options={serverAllocationStatus} />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ModalUpdate;
