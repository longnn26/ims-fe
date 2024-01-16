import appointment from "@services/appointment";
import { Button, Form, Input, Modal, Spin, message } from "antd";
import { useSession } from "next-auth/react";
import React, { useRef, useState } from "react";
const { confirm } = Modal;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  appointmentId: number;
}

const ModalDeny: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { open, onClose, appointmentId, onSubmit } = props;
  const { data: session } = useSession();

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const disabled = async () => {
    var result = false;
    try {
      await form.validateFields();
    } catch (errorInfo) {
      result = true;
    }
    return result;
  };

  const deny = async (data: string) => {
    setLoading(true);
    await appointment
      .denyAppointment(session?.user.access_token!, appointmentId + "", data)
      .then((res) => {
        message.success("Deny Appointment successfully!", 1.5);
        form.resetFields();
        onSubmit();
      })
      .catch((errors) => {
        message.error(errors.response.data, 1.5);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Modal
        title={<span className="inline-block m-auto">Deny Appointment</span>}
        open={open}
        confirmLoading={confirmLoading}
        onCancel={() => {
          onClose();
          form.resetFields();
        }}
        footer={[
          <Button
            className="btn-submit"
            key="submit"
            disabled={loading}
            onClick={async () => {
              if (!(await disabled()))
                confirm({
                  title: "Do you want to deny?",
                  async onOk() {
                    deny(form.getFieldValue("saleNote"));
                  },
                  onCancel() {},
                });
            }}
          >
            Deny
          </Button>,
        ]}
      >
        <div className="flex max-w-md flex-col gap-4 m-auto">
          <Spin spinning={loading} tip="Denying appointment..." size="large">
            <Form
              ref={formRef}
              form={form}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 20 }}
              style={{ width: "100%" }}
            >
              <Form.Item
                name="saleNote"
                label="Sales note for failure"
                rules={[{ required: true, max: 2000 }]}
              >
                <Input.TextArea
                  autoSize={{ minRows: 1, maxRows: 6 }}
                  placeholder="Note"
                  allowClear
                />
              </Form.Item>
            </Form>
          </Spin>
        </div>
      </Modal>
    </>
  );
};

export default ModalDeny;
