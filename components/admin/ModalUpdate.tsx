import React, { useRef, useState, useEffect } from "react";
import { Button, Input, Modal, Select, Space, Card } from "antd";
import { Form } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { UserUpdateModel, User } from "@models/user";
import useSelector from "@hooks/use-selector";
const { Option } = Select;
const { confirm } = Modal;

interface Props {
  open: boolean;
  onClose: () => void;
  data: User | undefined;
  onSubmit: (uUpdate: UserUpdateModel) => void;
}

const ModalUpdate: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { onSubmit, open, onClose, data } = props;

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
        email: data?.email,
        fullname: data?.fullname,
        address: data?.address,
        phoneNumber: data?.phoneNumber,
      });
  };

  useEffect(() => {
    // refresh after submit for fileList
    if (data && formRef.current) {
      setFieldsValueInitial();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <>
      <Modal
        title={
          <span className="inline-block m-auto">
            Update staff account information
          </span>
        }
        open={open}
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
                      id: data?.id!,
                      password: "P@ssword123",
                      email: form.getFieldValue("email"),
                      fullname: form.getFieldValue("fullname"),
                      address: form.getFieldValue("address"),
                      phoneNumber: form.getFieldValue("phoneNumber"),
                    };

                    // Call the provided onSubmit function with the formData
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
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ width: "100%" }}
            name="dynamic_form_complex"
          >
            <Form.Item label="Default Password" name="password">
              <Input readOnly defaultValue="P@ssword123" />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter staff email address" },
                {
                  pattern:
                    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
                  message: "Please enter a valid email address",
                },
                {
                  min: 6,
                  max: 255,
                  message: "Email must be between 6 and 255 characters",
                },
              ]}
            >
              <Input.TextArea
                autoSize={{ minRows: 1, maxRows: 6 }}
                allowClear
                placeholder="Email"
              />
            </Form.Item>
            <Form.Item
              label="Fullname"
              name="fullname"
              rules={[
                { required: true, message: "Please enter staff fullname" },
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
                placeholder="Fullname"
              />
            </Form.Item>
            <Form.Item
              label="Address"
              name="address"
              rules={[
                { required: true, message: "Please enter staff address" },
                {
                  min: 6,
                  max: 255,
                  message: "Address must be between 6 and 255 characters",
                },
              ]}
            >
              <Input.TextArea
                autoSize={{ minRows: 1, maxRows: 6 }}
                allowClear
                placeholder="Address"
              />
            </Form.Item>
            <Form.Item
              label="Phone Number"
              name="phoneNumber"
              rules={[
                { required: true, message: "Please enter staff phone number" },
                {
                  pattern:
                    /^(0|84)(2(0[3-9]|1[0-689]|2[0-25-9]|3[2-9]|4[0-9]|5[124-9]|6[0369]|7[0-7]|8[0-9]|9[012346789])|3[2-9]|5[25689]|7[06-9]|8[0-9]|9[012346789])([0-9]{7})$/gm,
                  message: "Please enter a valid phone number",
                },
              ]}
            >
              <Input.TextArea
                autoSize={{ minRows: 1, maxRows: 6 }}
                allowClear
                placeholder="Phone Number"
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ModalUpdate;
