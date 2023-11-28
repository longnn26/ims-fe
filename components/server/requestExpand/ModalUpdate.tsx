import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Modal } from "antd";
import { Form } from "antd";
import { RequestExpandUpdateModel, RequestExpand } from "@models/requestExpand";
const { confirm } = Modal;

interface Props {
  requestExpand: RequestExpand;
  onClose: () => void;
  onSubmit: (data: RequestExpandUpdateModel) => void;
}

const ModalUpdate: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { onSubmit, requestExpand, onClose } = props;

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
        id: requestExpand.id,
        size: requestExpand.size,
        note: requestExpand.note,
        techNote: requestExpand.techNote,
      });
  };

  useEffect(() => {
    // refresh after submit for fileList
    if (requestExpand) {
      setFieldsValueInitial();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestExpand]);

  return (
    <>
      <Modal
        title={
          <span className="inline-block m-auto">Update request expand</span>
        }
        open={Boolean(requestExpand)}
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
                      size: form.getFieldValue("size"),
                      note: form.getFieldValue("note"),
                      techNote: form.getFieldValue("techNote"),
                    } as RequestExpandUpdateModel);
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
            <Form.Item name="size" label="Size" rules={[{ required: true }]}>
              <Input placeholder="Size" allowClear />
            </Form.Item>
            <Form.Item name="note" label="Note">
              <Input placeholder="Note" allowClear />
            </Form.Item>
            <Form.Item name="techNote" label="Tech Note">
              <Input placeholder="Tech Note" allowClear />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ModalUpdate;
