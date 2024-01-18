import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  Input,
  Modal,
  Row,
  Select,
  Card,
  DatePicker,
  message,
  Spin,
} from "antd";
import { Form } from "antd";
import { Appointment, AppointmentUpdateModel } from "@models/appointment";
import customerService from "@services/customer";
import appointmentService from "@services/appointment";
import {
  ROLE_CUSTOMER,
  ROLE_SALES,
  ROLE_TECH,
  dateAdvFormat,
} from "@utils/constants";
import { useSession } from "next-auth/react";
import { areInArray, convertDatePicker, parseJwt } from "@utils/helpers";
import moment from "moment";
import dayjs from "dayjs";
const { Option } = Select;

const { confirm } = Modal;

interface Props {
  appointment: Appointment;
  onClose: () => void;
  // loadingSubmit: boolean;
  onSubmit: () => void;
}

const ModalCreate: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { onSubmit, appointment, onClose } = props;
  const { data: session, update: sessionUpdate } = useSession();

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [contactList, setContactList] = useState<string[] | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(false);

  const disabled = async () => {
    var result = false;
    try {
      await form.validateFields();
    } catch (errorInfo) {
      result = true;
    }
    return result;
  };

  const getContacts = async () => {
    await customerService
      .getCustomerById(session?.user.access_token!, appointment.customer.id)
      .then(async (data) => {
        const contacts = data.contacts
          .filter((l) => l.forAppointment === true)
          .map(
            (contact, index) =>
              `${contact.name} - - SĐT: ${contact.phoneNumber} - CCCD: ${contact.cccd}`
          );
        setContactList(contacts);
      });
  };

  const setFieldsValueInitial = () => {
    if (formRef.current)
      form.setFieldsValue({
        id: appointment.id,
        appointedCustomer: appointment.appointedCustomer?.split(","),
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

  useEffect(() => {
    if (session) {
      getContacts();
    }
  }, [session]);

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
                  title: "Do you want to save?",
                  async onOk() {
                    const dataUpdate = {
                      id: appointment.id,
                      appointedCustomer: form
                        .getFieldValue("appointedCustomer")
                        ?.join(","),
                      dateAppointed: form
                        .getFieldValue("dateAppointed")
                        .format(dateAdvFormat),
                      note: form.getFieldValue("note")
                        ? form.getFieldValue("note")
                        : appointment.note,
                      techNote: form.getFieldValue("techNote")
                        ? form.getFieldValue("techNote")
                        : appointment.techNote,
                      saleNote: form.getFieldValue("saleNote")
                        ? form.getFieldValue("saleNote")
                        : appointment.saleNote,
                    } as AppointmentUpdateModel;
                    setLoading(true);
                    await appointmentService
                      .update(session?.user.access_token!, dataUpdate)
                      .then((res) => {
                        message.success("Update successfully!", 1.5);
                        onSubmit();
                        form.resetFields();
                      })
                      .catch((errors) => {
                        message.error(errors.response.data, 1.5);
                      })
                      .finally(() => {
                        setLoading(false);
                      });
                  },
                  onCancel() {},
                });
            }}
          >
            Update
          </Button>,
        ]}
      >
        <div className="flex max-w-md flex-col gap-4 m-auto">
          {loading === true && (
            <Spin size="large" tip="Updating appointment...">
              <Form
                ref={formRef}
                form={form}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ width: "100%" }}
              >
                {areInArray(session?.user.roles!, ROLE_CUSTOMER) && (
                  <>
                    <Form.Item label="Visitor" rules={[{ required: true }]}>
                      {/* <Input placeholder="Visitor" allowClear /> */}
                      <Select
                        mode="multiple"
                        placeholder="Please select visitor(s) for appointment"
                        allowClear
                      >
                        {contactList &&
                          contactList.map((c, index) => (
                            <Option value={c} key={index}>
                              {`${c}`}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      label="Visit date"
                      rules={[
                        {
                          required: true,
                          validator: (_, value) => {
                            const todate = convertDatePicker(
                              moment().toString()
                            );
                            if (value.isAfter(todate)) {
                              return Promise.resolve();
                            } else {
                              return Promise.reject(
                                "Visit date must be later!"
                              );
                            }
                          },
                        },
                      ]}
                    >
                      <DatePicker
                        style={{ width: "100%" }}
                        placeholder="Visit date"
                        showTime
                      />
                    </Form.Item>
                    <Form.Item
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
                        allowClear
                        autoSize={{ minRows: 1, maxRows: 6 }}
                      />
                    </Form.Item>
                  </>
                )}

                {areInArray(session?.user.roles!, ROLE_SALES) && (
                  <>
                    <Form.Item
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
                        allowClear
                        autoSize={{ minRows: 1, maxRows: 6 }}
                      />
                    </Form.Item>
                  </>
                )}
              </Form>
            </Spin>
          )}
          {loading === false && (
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
                    {/* <Input placeholder="Visitor" allowClear /> */}
                    <Select
                      mode="multiple"
                      placeholder="Please select visitor(s) for appointment"
                      allowClear
                      onChange={(selectedValues) => {
                        form.setFieldsValue({
                          appointedCustomer: selectedValues.map(
                            (value) => value
                          ),
                        });
                      }}
                    >
                      {contactList &&
                        contactList.map((c, index) => (
                          <Option value={c} key={index}>
                            {`${c}`}
                          </Option>
                        ))}
                    </Select>
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
                      disabledDate={(current) => {
                        const now = dayjs();
                        const isBeforeToday =
                          current && current.isBefore(now, "day");
                        const isToday = current && current.isSame(now, "day");
                        const isDisabledTime =
                          current &&
                          now.isSame(current, "day") &&
                          (current.hour() < 8 || current.hour() > 17);

                        return isBeforeToday || (isToday && isDisabledTime);
                      }}
                      disabledTime={() => ({
                        disabledHours: () => [
                          0, 1, 2, 3, 4, 5, 6, 7, 18, 19, 20, 21, 22, 23, 24,
                        ],
                      })}
                      format={dateAdvFormat}
                      onChange={(value) =>
                        form.setFieldsValue({
                          dateAppointed: value,
                        })
                      }
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
          )}
        </div>
      </Modal>
    </>
  );
};

export default ModalCreate;
