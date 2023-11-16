import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Modal } from "antd";
import { Form } from "antd";
import { RackUpdateModel, Rack } from "@models/rack";
const { confirm } = Modal;

interface Props {
  rack: Rack;
  onClose: () => void;
  onSubmit: (data: RackUpdateModel) => void;
}

const ModalUpdate: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { onSubmit, rack, onClose } = props;

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
        id: rack.id,
        maxPower: rack.maxPower,
        currentPower: rack.currentPower,
        column: rack.column,
        row: rack.row,
        size: rack.size,
        areaId: rack.areaId,
      });
  };

  useEffect(() => {
    // refresh after submit for fileList
    if (rack) {
      setFieldsValueInitial();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rack]);

  return (
    <>
      <Modal
        title={<span className="inline-block m-auto">Update rack</span>}
        open={Boolean(rack)}
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
                      maxPower: form.getFieldValue("maxPower"),
                      currentPower: form.getFieldValue("currentPower"),
                      column: form.getFieldValue("column"),
                      row: form.getFieldValue("row"),
                      size: form.getFieldValue("size"),
                      areaId: form.getFieldValue("areaId"),
                    } as RackUpdateModel);
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
              name="maxPower"
              label="Max Power"
              rules={[{ required: true }]}
            >
              <Input placeholder="Max Power" allowClear />
            </Form.Item>
            <Form.Item
              name="currentPower"
              label="Current Power"
              rules={[{ required: true }]}
            >
              <Input placeholder="Current Power" allowClear />
            </Form.Item>
            <Form.Item
              name="column"
              label="Column"
              rules={[{ required: true }]}
            >
              <Input placeholder="Column" allowClear />
            </Form.Item>
            <Form.Item
              name="row"
              label="Row"
              rules={[{ required: true }]}
            >
              <Input placeholder="RÏow" allowClear />
            </Form.Item>
            <Form.Item
              name="size"
              label="Size"
              rules={[{ required: true }]}
            >
              <Input placeholder="SÏize" allowClear />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ModalUpdate;
