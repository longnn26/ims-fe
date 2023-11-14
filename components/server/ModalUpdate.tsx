import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Modal, Select } from "antd";
import { Form } from "antd";
import {
  SAUpdateModel,
  ServerAllocation,
} from "@models/serverAllocation";
import { optionStatus } from "@utils/constants";
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
        expectedSize: serverAllocation.expectedSize,
        note: serverAllocation.note,
        inspectorNote: serverAllocation.inspectorNote,
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
                      status: form.getFieldValue("status").value,
                      expectedSize: form.getFieldValue("expectedSize"),
                      note: form.getFieldValue("note"),
                      inspectorNote: form.getFieldValue("inspectorNote"),
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
              name="expectedSize"
              label="Expected Size"
              rules={[{ required: true }]}
            >
              <Input placeholder="Expected Size" allowClear />
            </Form.Item>
            <Form.Item name="note" label="Note">
              <Input placeholder="Note" allowClear />
            </Form.Item>
            <Form.Item name="inspectorNote" label="Inspector Note">
              <Input placeholder="Inspector Note" allowClear />
            </Form.Item>
            <Form.Item
              name="status"
              label="Status"
              labelAlign="right"
              rules={[{ required: true, message: "Status not empty" }]}
            >
              <Select labelInValue allowClear options={optionStatus} />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ModalUpdate;
