import { RequestHost, RequestHostUpdateModel } from "@models/requestHost";
import { Button, Form, Input, Modal } from "antd";
import React, { useEffect, useRef, useState } from "react";
const { confirm } = Modal;

interface Props {
  requestHost: RequestHost;
  onClose: () => void;
  onSubmit: (RequestHostUpdateModel: RequestHostUpdateModel) => void;
}

const ModalUpdate: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { onSubmit, requestHost, onClose } = props;

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
        id: requestHost.id,
        note: requestHost.note,
        saleNote: requestHost.saleNote,
        techNote: requestHost.techNote,
        quantity: requestHost.quantity,
        type: requestHost.type,
      });
  };

  useEffect(() => {
    // refresh after submit for fileList
    if (requestHost) {
      setFieldsValueInitial();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestHost]);

  return (
    <>
      <Modal
        title={<span className="inline-block m-auto">Update request host</span>}
        open={Boolean(requestHost)}
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
                      saleNote: form.getFieldValue("saleNote"),
                      techNote: form.getFieldValue("techNote"),
                      quantity: form.getFieldValue("quantity"),
                      note: form.getFieldValue("note"),
                      type: form.getFieldValue("type"),
                    } as RequestHostUpdateModel);
                    form.resetFields();
                    onClose();
                  },
                  onCancel() {},
                });
            }}
          >
            Edit
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
            {/* <Form.Item name="note" label="Note" rules={[{ required: true }]}>
              <Input placeholder="Note" allowClear />
            </Form.Item> */}

            <Form.Item
              name="saleNote"
              label="Sale Note"
              rules={[
                {
                  pattern: new RegExp(/^\b(\w+\W*){1,2000}\b/),
                  message: "Sale note no more than 2000 words",
                },
              ]}
            >
              <Input placeholder="Sale Note" allowClear />
            </Form.Item>

            {/* <Form.Item name="techNote" label="Tech Note">
              <Input placeholder="Tech Note" allowClear />
            </Form.Item>

            <Form.Item name="type" label="Type">
              <Input placeholder="Type" allowClear />
            </Form.Item> */}

            <Form.Item
              name="quantity"
              label="Quantity"
              rules={[
                {
                  required: true,
                },
                {
                  pattern: new RegExp(/^[1-9]\d*$/),
                  message: "Quantity must be a number",
                },
              ]}
            >
              <Input placeholder="Quantity" allowClear />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ModalUpdate;
