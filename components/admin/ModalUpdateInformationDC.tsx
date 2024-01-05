import React, { useRef, useState, useEffect } from "react";
import { Button, Input, Modal, Select, Space, Card } from "antd";
import { Form } from "antd";
import useSelector from "@hooks/use-selector";
import { InformationDC } from "@models/informationDC";
const { confirm } = Modal;

interface Props {
  onClose: () => void;
  data: InformationDC | undefined;
  onSubmit: (informationUpdate: InformationDC) => void;
}

const ModalUpdateInformationDC: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { onSubmit, onClose, data } = props;

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
    if (formRef.current && data) {
      form.setFieldsValue({
        qtName: data.qtName,
        position: data.position,
      });
    }
  };
  useEffect(() => {
    if (data && formRef.current) {
      setFieldsValueInitial();
    }
  }, [data, formRef.current]);

  return (
    <>
      <Modal
        title={
          <span className="inline-block m-auto">
            Update staff account information
          </span>
        }
        open={Boolean(data)}
        confirmLoading={confirmLoading}
        onCancel={() => {
          onClose();
        }}
        footer={[
          <Button
            className="btn-submit"
            key="submit"
            onClick={async () => {
              if (!(await disabled()))
                confirm({
                  title: "Do you want to save?",
                  async onOk() {
                    const formData = {
                      qtName: form.getFieldValue("qtName"),
                      position: form.getFieldValue("position"),
                    };
                    onSubmit(formData);
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
            labelCol={{ span: 12 }}
            wrapperCol={{ span: 16 }}
            style={{ width: "100%" }}
            // name="dynamic_form_complex"
          >
            <Form.Item
              label="Quang Trung Representator"
              name="qtName"
              rules={[
                {
                  required: true,
                  message:
                    "Please enter full name of Quang Trung representator",
                },
                {
                  min: 6,
                  max: 255,
                  message: "Name must be between 6 and 255 characters",
                },
              ]}
            >
              <Input.TextArea
                autoSize={{ minRows: 1, maxRows: 6 }}
                allowClear
                placeholder="Quang Trung Representator"
              />
            </Form.Item>
            <Form.Item
              label="Position"
              name="position"
              rules={[
                { required: true, message: "Please enter position" },
                {
                  min: 6,
                  max: 255,
                  message: "Name must be between 6 and 255 characters",
                },
              ]}
            >
              <Input.TextArea
                autoSize={{ minRows: 1, maxRows: 6 }}
                allowClear
                placeholder="Position"
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ModalUpdateInformationDC;
