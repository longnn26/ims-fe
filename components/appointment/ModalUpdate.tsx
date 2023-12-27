import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Input, Modal, Row, Select, Card, DatePicker } from "antd";
import { Form } from "antd";
import { Appointment, AppointmentUpdateModel } from "@models/appointment";
import {
  ROLE_CUSTOMER,
  ROLE_SALES,
  ROLE_TECH,
  dateAdvFormat,
} from "@utils/constants";
import { useSession } from "next-auth/react";
import { areInArray, convertDatePicker } from "@utils/helpers";
import moment from "moment";
const { Option } = Select;

const { confirm } = Modal;

interface Props {
  appointment: Appointment;
  onClose: () => void;
  // loadingSubmit: boolean;
  onSubmit: (data: AppointmentUpdateModel) => void;
}

const ModalCreate: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { onSubmit, appointment, onClose } = props;
  const { data: session, update: sessionUpdate } = useSession();

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
        appointedCustomer: appointment.appointedCustomer,
        dateAppointed: convertDatePicker(appointment.dateAppointed),
        note: appointment.note,
        techNote: appointment.techNote,
        saleNote: appointment.saleNote,
      });
  };

  useEffect(() => {
    // refresh after submit for fileList
    if (appointment && session) {
      setFieldsValueInitial();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, appointment]);

  return (
    <>
      <Modal
        title={
          <span className="inline-block m-auto">
            {"Edit Appointment's Information"}
          </span>
        }
        open={Boolean(appointment)}
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
                      id: appointment.id,
                      appointedCustomer: form.getFieldValue("appointedCustomer")
                        ? form.getFieldValue("appointedCustomer")
                        : appointment.appointedCustomer,
                      dateAppointed: form.getFieldValue("dateAppointed"),
                      note: form.getFieldValue("note")
                        ? form.getFieldValue("note")
                        : appointment.note,
                      techNote: form.getFieldValue("techNote")
                        ? form.getFieldValue("techNote")
                        : appointment.techNote,
                      saleNote: form.getFieldValue("saleNote")
                        ? form.getFieldValue("saleNote")
                        : appointment.saleNote,
                    } as AppointmentUpdateModel);
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
            {areInArray(session?.user.roles!, ROLE_CUSTOMER) && (
              <>
                <Form.Item
                  name="appointedCustomer"
                  label="Visitor"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Visitor" allowClear />
                </Form.Item>
                <Form.Item
                  name="dateAppointed"
                  label="Visit date"
                  rules={[
                    {
                      required: true,
                      validator: (_, value) => {
                        const todate = convertDatePicker(moment().toString());
                        if (value.isAfter(todate)) {
                          return Promise.resolve();
                        } else {
                          return Promise.reject("Visit date must be later!");
                        }
                      },
                    },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    placeholder="Visit date"
                    showTime
                    format={dateAdvFormat}
                  />
                </Form.Item>
                <Form.Item
                  name="note"
                  label="Note"
                  rules={[
                    {
                      required: true,
                      max: 2000,
                      message: "Update appointment must enter your note!",
                    },
                  ]}
                >
                  <Input.TextArea
                    placeholder="Note"
                    allowClear
                    autoSize={{ minRows: 1, maxRows: 6 }}
                  />
                </Form.Item>
              </>
            )}

            {areInArray(session?.user.roles!, ROLE_SALES) && (
              <>
                <Form.Item
                  name="saleNote"
                  label="Note"
                  rules={[
                    {
                      required: true,
                      max: 2000,
                      message: "Update appointment must enter your note!",
                    },
                  ]}
                >
                  <Input.TextArea
                    placeholder="Note"
                    allowClear
                    autoSize={{ minRows: 1, maxRows: 6 }}
                  />
                </Form.Item>
              </>
            )}
            {areInArray(session?.user.roles!, ROLE_TECH) && (
              <>
                <Form.Item
                  name="techNote"
                  label="Note"
                  rules={[
                    {
                      required: true,
                      max: 2000,
                      message: "Update appointment must enter your note!",
                    },
                  ]}
                >
                  <Input.TextArea
                    placeholder="Note"
                    allowClear
                    autoSize={{ minRows: 1, maxRows: 6 }}
                  />
                </Form.Item>
              </>
            )}
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ModalCreate;
