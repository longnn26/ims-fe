import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Modal, Select } from "antd";
import { Form } from "antd";
import { AreaUpdateModel, Area } from "@models/area";
const { confirm } = Modal;

interface Props {
  area: Area;
  onClose: () => void;
  onSubmit: (data: AreaUpdateModel) => void;
}

const ModalUpdate: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { onSubmit, area, onClose } = props;

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
        id: area.id,
        name: area.name,
        rowCount: area.rowCount,
        columnCount: area.columnCount,
      });
  };

  useEffect(() => {
    // refresh after submit for fileList
    if (area) {
      setFieldsValueInitial();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [area]);

  return (
    <>
      <Modal
        title={<span className="inline-block m-auto">Update area</span>}
        open={Boolean(area)}
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
                      rowCount: form.getFieldValue("rowCount"),
                      columnCount: form.getFieldValue("columnCount"),
                    } as Area);
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
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input placeholder="Name" allowClear />
            </Form.Item>
            <Form.Item
              name="rowCount"
              label="Row Count"
              rules={[{ required: true }]}
            >
              <Input placeholder="Row Count" allowClear />
            </Form.Item>
            <Form.Item
              name="columnCount"
              label="Column Count"
              rules={[{ required: true }]}
            >
              <Input placeholder="Column Count" allowClear />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ModalUpdate;
