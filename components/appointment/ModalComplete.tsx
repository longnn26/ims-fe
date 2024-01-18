import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  DatePicker,
  Divider,
  Input,
  Modal,
  Select,
  Spin,
  Switch,
  message,
} from "antd";
import { Form } from "antd";
import { ComponentUpdateModel, ComponentObj } from "@models/component";
import { dateAdvFormat, optionStatus } from "@utils/constants";
import {
  Appointment,
  AppointmentComplete,
  DocumentModelAppointment,
} from "@models/appointment";
import appointmentService from "@services/appointment";
import { convertDatePicker } from "@utils/helpers";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
const { confirm } = Modal;

interface Props {
  open: boolean;
  appointment: Appointment;
  onClose: () => void;
  onSubmit: () => void;
}

const ModalComplete: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { data: session } = useSession();
  const { onSubmit, appointment, onClose, open } = props;

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 18 },
  };

  const formSwitchLayout = {
    labelCol: { span: 40 },
    wrapperCol: { span: 4, flex: "right" },
  };

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
        id: appointment.id,
        dateCheckedIn: !appointment.dateCheckedIn
          ? undefined
          : convertDatePicker(appointment?.dateCheckedIn),
        dateCheckedOut: !appointment.dateCheckedOut
          ? undefined
          : convertDatePicker(appointment?.dateCheckedOut),
        techNote: appointment.techNote,
        //isCorrectPerson: appointment.isCorrectPerson,
      });
  };

  const complete = async (model: AppointmentComplete) => {
    setLoading(true);
    await appointmentService
      .completeAppointment(session?.user.access_token!, appointment?.id!, model)
      .then((res) => {
        message.success("Complete appointment successfully!", 1.5);
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

  useEffect(() => {
    // refresh after submit for fileList
    if (appointment) {
      setFieldsValueInitial();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointment]);

  return (
    <>
      <Modal
        title={
          <span className="inline-block m-auto">Complete Appointment</span>
        }
        width={600}
        open={open}
        confirmLoading={confirmLoading}
        onCancel={() => {
          onClose();
          form.resetFields();
        }}
        footer={[
          <Button
            // loading={confirmLoading}
            className="btn-submit"
            key="submit"
            onClick={async () => {
              if (!(await disabled()))
                confirm({
                  title: "Do you want to complete appointment?",
                  async onOk() {
                    var documentModel = {
                      // qtName: form.getFieldValue("qtName"),
                      // position: form.getFieldValue("position"),
                      // location: form.getFieldValue("location"),
                      username: form.getFieldValue("username")
                        ? form.getFieldValue("username")
                        : ".",
                      isSendMS: form.getFieldValue("isSendMS")
                        ? form.getFieldValue("isSendMS")
                        : false,
                      good: true,
                      guid: form.getFieldValue("guid")
                        ? form.getFieldValue("guid")
                        : false,
                      note: form.getFieldValue("note")
                        ? form.getFieldValue("note")
                        : ".",
                      deviceCondition: form.getFieldValue("deviceCondition")
                        ? form.getFieldValue("deviceCondition")
                        : ".",
                    } as DocumentModelAppointment;

                    var model = {
                      documentModel: documentModel,
                      dateCheckedIn: form
                        .getFieldValue("dateCheckedIn")
                        ?.format(dateAdvFormat),
                      dateCheckedOut: form
                        .getFieldValue("dateCheckedOut")
                        ?.format(dateAdvFormat),
                      //isCorrectPerson: form.getFieldValue("isCorrectPerson"),
                    } as AppointmentComplete;
                    complete(model);
                  },
                  onCancel() {},
                });
            }}
          >
            Complete
          </Button>,
        ]}
      >
        <div className="flex max-w-md flex-col gap-4 m-auto">
          <Spin size="large" tip="Creating reports..." spinning={loading}>
            <Form
              ref={formRef}
              form={form}
              labelAlign="left"
              style={{ width: "100%" }}
              labelWrap={true}
            >
              {appointment &&
                appointment?.reason &&
                appointment?.reason === "Install" && (
                  <>
                    <Divider style={{ fontWeight: 400 }}>
                      Create Reports
                    </Divider>
                    <Form.Item
                      {...formItemLayout}
                      name="username"
                      label="Bandwidth Username"
                      rules={[{ max: 255 }]}
                    >
                      <Input placeholder="Username" allowClear />
                    </Form.Item>
                    <Form.Item
                      {...formSwitchLayout}
                      name="isSendMS"
                      label="SMS Password message send"
                    >
                      <Switch
                        onChange={(value) =>
                          form.setFieldsValue({
                            isSendMS: value,
                          })
                        }
                      />{" "}
                    </Form.Item>
                    <Form.Item
                      {...formSwitchLayout}
                      name="guid"
                      label="Instructed customers to change password after the 1st login"
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
                      {...formItemLayout}
                      name="deviceCondition"
                      label="Server condition"
                      rules={[{ max: 2000 }]}
                    >
                      <Input placeholder="Server condition" allowClear />
                    </Form.Item>
                  </>
                )}
              <Form.Item
                {...formItemLayout}
                name="note"
                label="Note"
                rules={[{ max: 2000 }]}
              >
                <Input placeholder="Note" allowClear />
              </Form.Item>
              <Divider style={{ fontWeight: 400 }}>
                Record Customer visit
              </Divider>
              <Form.Item
                {...formItemLayout}
                name="dateCheckedIn"
                label="Date CheckedIn"
                rules={[
                  { required: true, message: "Please select Date CheckedIn" },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder="Date CheckedIn"
                  showTime
                  disabledTime={
                    appointment?.reason !== "Incident"
                      ? () => ({
                          disabledHours: () => [
                            0, 1, 2, 3, 4, 5, 6, 7, 18, 19, 20, 21, 22, 23, 24,
                          ],
                        })
                      : () => ({
                          disabledHours: () => [],
                        })
                  }
                  format={dateAdvFormat}
                  onChange={(value) =>
                    form.setFieldsValue({
                      dateCheckedIn: value,
                      dateCheckedOut: value,
                    })
                  }
                />
              </Form.Item>
              <Form.Item
                {...formItemLayout}
                name="dateCheckedOut"
                label="Date CheckedOut"
                rules={[
                  { required: true, message: "Please select Date CheckedOut" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const dateCheckedIn = form.getFieldValue("dateCheckedIn");
                      if (value.isAfter(dateCheckedIn.add("1", "second"))) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        "Date CheckedOut must be after Date CheckedIn"
                      );
                    },
                  }),
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder="Date CheckedOut"
                  showTime
                  disabledTime={
                    appointment?.reason !== "Incident"
                      ? () => ({
                          disabledHours: () => [
                            0, 1, 2, 3, 4, 5, 6, 7, 18, 19, 20, 21, 22, 23, 24,
                          ],
                        })
                      : () => ({
                          disabledHours: () => [],
                        })
                  }
                  format={dateAdvFormat}
                  onChange={(value) =>
                    form.setFieldsValue({
                      dateCheckedOut: value,
                    })
                  }
                />
              </Form.Item>
            </Form>
          </Spin>
        </div>
      </Modal>
    </>
  );
};

export default ModalComplete;
