import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  DatePicker,
  Input,
  Modal,
  Select,
  Switch,
  message,
} from "antd";
import { Form } from "antd";
import {
  Appointment,
  AppointmentFail,
  DocumentModelAppointment,
} from "@models/appointment";
import { convertDatePicker } from "@utils/helpers";
import appointment from "@services/appointment";
import { useSession } from "next-auth/react";
const { confirm } = Modal;

interface Props {
  appointmentDetail: Appointment;
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const ModalFail: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { data: session } = useSession();
  const { onSubmit, onClose, open, appointmentDetail } = props;

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

  const failAppointment = async (data: AppointmentFail) => {
    setLoading(true);
    await appointment
      .failAppointment(
        session?.user.access_token!,
        appointmentDetail?.id + "",
        data
      )
      .then((res) => {
        message.success("Fail appointment successfully!", 1.5);
        onSubmit();
        form.resetFields();
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
        title={<span className="inline-block m-auto">Fail Appointment</span>}
        open={open}
        confirmLoading={confirmLoading}
        onCancel={() => {
          onClose();
          form.resetFields();
        }}
        footer={[
          <Button
            // loading={loadingSubmit}
            className="btn-submit"
            key="submit"
            disabled={loading}
            onClick={async () => {
              if (!(await disabled()))
                confirm({
                  title: "Do you want to fail appointment?",
                  async onOk() {
                    var documentModel = {
                      username: form.getFieldValue("username")
                        ? form.getFieldValue("username")
                        : "",
                      isSendMS: form.getFieldValue("isSendMS")
                        ? form.getFieldValue("isSendMS")
                        : false,
                      good: false,
                      guid: false,
                      note: form.getFieldValue("techNote"),
                      deviceCondition: form.getFieldValue("deviceCondition"),
                    } as DocumentModelAppointment;
                    const data = {
                      documentModel,
                      techNote: form.getFieldValue("techNote"),
                    } as AppointmentFail;
                    failAppointment(data);
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
            {(appointmentDetail?.reason === "Install" ||
              appointmentDetail?.reason === "Uninstall") && (
              <>
                <Form.Item
                  name="username"
                  label="Bandwidth Username"
                  rules={[{ max: 255 }]}
                >
                  <Input placeholder="Username" allowClear />
                </Form.Item>
                <Form.Item name="isSendMS" label="SMS Password message send">
                  <Switch
                    onChange={(value) =>
                      form.setFieldsValue({
                        isSendMS: value,
                      })
                    }
                  />{" "}
                </Form.Item>
                <Form.Item
                  name="guid"
                  label={
                    <span style={{ width: "200px", display: "inline-block" }}>
                      Instructed customers to change password after the 1st
                      login
                    </span>
                  }
                >
                  <Switch
                    onChange={(value) =>
                      form.setFieldsValue({
                        guid: value,
                      })
                    }
                  />{" "}
                </Form.Item>
                <Form.Item
                  name="deviceCondition"
                  label="Server condition"
                  rules={[{ required: true, max: 2000 }]}
                >
                  <Input placeholder="Server condition" allowClear />
                </Form.Item>
                <Form.Item
                  name="techNote"
                  label="Note"
                  rules={[{ required: true, max: 2000 }]}
                >
                  <Input placeholder="Note" allowClear />
                </Form.Item>
              </>
            )}
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ModalFail;
