import React, { useEffect, useRef, useState } from "react";
import { Button, DatePicker, Input, Modal, Select, Switch } from "antd";
import { Form } from "antd";
import { ComponentUpdateModel, ComponentObj } from "@models/component";
import { dateAdvFormat, optionStatus } from "@utils/constants";
import { Appointment, AppointmentComplete } from "@models/appointment";
import { convertDatePicker } from "@utils/helpers";
const { confirm } = Modal;

interface Props {
  open: boolean;
  appointment: Appointment;
  onClose: () => void;
  onSubmit: (data: AppointmentComplete) => void;
}

const ModalComplete: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { onSubmit, appointment, onClose, open } = props;

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
        id: appointment.id,
        dateCheckedIn: !appointment.dateCheckedIn
          ? undefined
          : convertDatePicker(appointment?.dateCheckedIn),
        dateCheckedOut: !appointment.dateCheckedOut
          ? undefined
          : convertDatePicker(appointment?.dateCheckedOut),
        techNote: appointment.techNote,
        isCorrectPerson: appointment.isCorrectPerson,
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
            onClick={async () => {
              if (!(await disabled()))
                confirm({
                  title: "Do you want to complete appointment?",
                  async onOk() {
                    onSubmit({
                      dateCheckedIn: form
                        .getFieldValue("dateCheckedIn")
                        ?.format(dateAdvFormat),
                      dateCheckedOut: form
                        .getFieldValue("dateCheckedOut")
                        ?.format(dateAdvFormat),
                      techNote: form.getFieldValue("techNote"),
                      isCorrectPerson: form.getFieldValue("isCorrectPerson"),
                    } as AppointmentComplete);
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
              name="dateCheckedIn"
              label="Date CheckedIn"
              rules={[{ required: true }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                placeholder="Date CheckedIn"
                showTime
                format={dateAdvFormat}
                onChange={(value) =>
                  form.setFieldsValue({
                    dateCheckedIn: value,
                  })
                }
              />{" "}
            </Form.Item>
            <Form.Item
              name="dateCheckedOut"
              label="Date CheckedOut"
              rules={[{ required: true }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                placeholder="Date CheckedOut"
                showTime
                format={dateAdvFormat}
                onChange={(value) =>
                  form.setFieldsValue({
                    dateCheckedOut: value,
                  })
                }
              />{" "}
            </Form.Item>
            <Form.Item
              name="techNote"
              label="Tech Note"
              rules={[{ required: true }]}
            >
              <Input placeholder="Tech Note" allowClear />
            </Form.Item>

            <Form.Item name="isCorrectPerson" label="Correct Person">
              <Switch
                defaultChecked={appointment?.isCorrectPerson}
                onChange={(value) =>
                  form.setFieldsValue({
                    isCorrectPerson: value,
                  })
                }
              />{" "}
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ModalComplete;
