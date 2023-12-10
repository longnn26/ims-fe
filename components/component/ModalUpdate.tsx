import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Modal, Radio, Select } from "antd";
import { Form } from "antd";
import { ComponentUpdateModel, ComponentObj } from "@models/component";
import { optionStatus } from "@utils/constants";
const { confirm } = Modal;

interface Props {
  component: ComponentObj;
  onClose: () => void;
  onSubmit: (saCreateModel: ComponentUpdateModel) => void;
}

const ModalUpdate: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { onSubmit, component, onClose } = props;

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
        id: component.id,
        description: component.description,
        name: component.name,
        isRequired: component.isRequired,
        // unit: component.unit,
        // type: component.type,
      });
  };

  useEffect(() => {
    // refresh after submit for fileList
    if (component) {
      setFieldsValueInitial();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [component]);

  return (
    <>
      <Modal
        title={<span className="inline-block m-auto">Update component</span>}
        open={Boolean(component)}
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
                      description: form.getFieldValue("description"),
                      isRequired: form.getFieldValue("isRequired"),
                      unit: form.getFieldValue("unit"),
                      type: form.getFieldValue("type"),
                    } as ComponentUpdateModel);
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
              label="Name"
              rules={[{ required: true, min: 1, max: 255 }]}
            >
              <Input placeholder="Name" allowClear />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input placeholder="Description" allowClear />
            </Form.Item>
            <Form.Item
              label="Is Server Requires"
              name="isRequired"
              rules={[{ required: true }]}
            >
              <Radio.Group>
                <Radio value={true}> yes </Radio>
                <Radio value={false}> No </Radio>
              </Radio.Group>
            </Form.Item>
            {/* <Form.Item name="unit" label="Unit" rules={[{ required: true }]}>
              <Input placeholder="Unit" allowClear />
            </Form.Item>
            <Form.Item name="type" label="Type" rules={[{ required: true }]}>
              <Input placeholder="Type" allowClear />
            </Form.Item> */}
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ModalUpdate;
