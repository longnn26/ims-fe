import { ParamGet } from "@models/base";
import { User } from "@models/user";
import appointment from "@services/appointment";
import authService from "@services/user";
import { Button, Form, Input, Modal, Select, Spin, message } from "antd";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
const { confirm } = Modal;
const { Option } = Select;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  appointmentId: number;
}

const ModalAccept: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { open, onClose, appointmentId, onSubmit } = props;
  const { data: session, update: sessionUpdate } = useSession();

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

  const accept = async (data: string) => {
    setLoading(true);
    await appointment
      .acceptAppointment(session?.user.access_token!, appointmentId + "", data)
      .then((res) => {
        message.success("Accept Appointment successfully!", 1.5);
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

  useEffect(() => {
    session;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return (
    <>
      <Modal
        title={<span className="inline-block m-auto">Accept Appointment</span>}
        open={open}
        confirmLoading={confirmLoading}
        onCancel={() => {
          onClose();
          form.resetFields();
        }}
        footer={[
          <Button
            // loading={loadingSubmit}
            disabled={loading}
            className="btn-submit"
            key="submit"
            onClick={async () => {
              if (!(await disabled()))
                confirm({
                  title: "Do you want to accept?",
                  async onOk() {
                    accept(form.getFieldValue("saleNote"));
                  },
                  onCancel() {},
                });
            }}
          >
            Accept
          </Button>,
        ]}
      >
        <div className="flex max-w-md flex-col gap-4 m-auto">
          <Spin spinning={loading} tip="Accepting appointment..." size="large">
            <Form
              ref={formRef}
              form={form}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ width: "100%" }}
            >
              <Form.Item
                name="saleNote"
                label="Sales Staff Note"
                rules={[{ max: 2000 }]}
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

export default ModalAccept;
