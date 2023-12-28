import React, { useEffect, useRef, useState } from "react";
import { Button, DatePicker, Input, Modal, Select, Switch } from "antd";
import { Form } from "antd";
import { ComponentUpdateModel, ComponentObj } from "@models/component";
import { dateAdvFormat, optionStatus } from "@utils/constants";
import {
  Appointment,
  AppointmentComplete,
  DocumentModelAppointment,
} from "@models/appointment";
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
        width={700}
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
                      qtName: form.getFieldValue("qtName"),
                      position: form.getFieldValue("position"),
                      location: form.getFieldValue("location"),
                      username: form.getFieldValue("username"),
                      isSendMS: form.getFieldValue("isSendMS"),
                      good: form.getFieldValue("good"),
                      guid: form.getFieldValue("guid"),
                      note: form.getFieldValue("note"),
                    } as DocumentModelAppointment;

                    var model = {
                      documentModel: documentModel,
                      dateCheckedIn: form
                        .getFieldValue("dateCheckedIn")
                        ?.format(dateAdvFormat),
                      dateCheckedOut: form
                        .getFieldValue("dateCheckedOut")
                        ?.format(dateAdvFormat),
                      isCorrectPerson: form.getFieldValue("isCorrectPerson"),
                    } as AppointmentComplete;

                    onSubmit(model);
                    // form.resetFields();
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
            labelCol={{ span: 9 }}
            labelAlign="left"
            size="small"
            wrapperCol={{ span: 10 }}
            style={{ width: "130%" }}
          >
            {/* <Form.Item
              name="number"
              label="Contract number"
              rules={[{ required: true, min: 6, max: 255 }]}
            >
              <Input placeholder="Contract number" allowClear />
            </Form.Item>
            <Form.Item
              name="customerName"
              label="Customer name"
              rules={[{ required: true, min: 6, max: 255 }]}
            >
              <Input placeholder="Customer name" allowClear />
            </Form.Item>
            <Form.Item
              name="customerPosition"
              label="Customer Position"
              rules={[{ required: true, min: 6, max: 255 }]}
            >
              <Input placeholder="Customer Position" allowClear />
            </Form.Item> */}
            <Form.Item
              name="qtName"
              label="QTSC Representor"
              rules={[{ required: true, min: 6, max: 255 }]}
            >
              <Input placeholder="QTSC Representor" allowClear />
            </Form.Item>
            <Form.Item
              name="position"
              label="Representor position"
              rules={[{ required: true, min: 6, max: 255 }]}
            >
              <Input placeholder="Representor position" allowClear />
            </Form.Item>
            <Form.Item
              name="location"
              label="Installation/Delivery location"
              rules={[{ required: true, min: 6, max: 2000 }]}
            >
              <Input placeholder="Installation/ Delivery location" allowClear />
            </Form.Item>
            {appointment.purpose === "Expand" && (
              <>
                <Form.Item name="username" label="Username" rules={[{ max: 255 }]}>
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
                      Instructed customers to change password after the 1st login
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
                  label="Device condition"
                  rules={[{ max: 2000 }]}
                >
                  <Input placeholder="Device condition" allowClear />
                </Form.Item>
              </>
            )}
            
            <Form.Item name="good" label="Good">
              <Switch
                onChange={(value) =>
                  form.setFieldsValue({
                    good: value,
                  })
                }
              />{" "}
            </Form.Item>
            
            <Form.Item name="note" label="Note" rules={[{ max: 2000 }]}>
              <Input placeholder="Note" allowClear />
            </Form.Item>
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
