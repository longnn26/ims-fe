import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  DatePicker,
  Input,
  Modal,
  Select,
  Spin,
  Switch,
  message,
} from "antd";
import { Form } from "antd";
import { dateAdvFormat, optionStatus } from "@utils/constants";
import { Appointment, AppointmentComplete } from "@models/appointment";
import incidentService from "@services/incident";
import { convertDatePicker } from "@utils/helpers";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { IncidentResolve, IncidentResolveModel } from "@models/incident";
const { confirm } = Modal;

interface Props {
  open: boolean;
  appointment: Appointment;
  resolve: IncidentResolve;
  onClose: () => void;
  onSubmit: () => void;
}

const ModalResolveIncident: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { data: session } = useSession();
  const { onSubmit, resolve, appointment, onClose, open } = props;

  const [confirmLoading, setConfirmLoading] = useState(false);
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
      });
  };

  const resolveAppointment = async (model: IncidentResolve) => {
    setLoading(true);
    await incidentService
      .resolveAppointment(session?.user.access_token!, appointment?.id!, model)
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
          <span className="inline-block m-auto">
            Complete Appointment Resolve Incident
          </span>
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
                    var incidentResolvModel = {
                      solution: form.getFieldValue("solution"),
                    } as IncidentResolveModel;

                    var model = {
                      dateCheckedIn: form
                        .getFieldValue("dateCheckedIn")
                        ?.format(dateAdvFormat),
                      dateCheckedOut: form
                        .getFieldValue("dateCheckedOut")
                        ?.format(dateAdvFormat),
                      incidentResolvModel: incidentResolvModel,
                    } as IncidentResolve;
                    resolveAppointment(model);
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
          {loading === true ? (
            <Spin size="large" tip="Creating reports...">
              <Form
                ref={formRef}
                form={form}
                labelCol={{ span: 8 }}
                labelAlign="left"
                wrapperCol={{ span: 20 }}
                style={{ width: "100%" }}
                labelWrap={true}
              >
                <Form.Item
                  name="solution"
                  label="Solution of incident"
                  rules={[{ required: true, min: 3, max: 2000 }]}
                >
                  <Input placeholder="Solution of incident" allowClear />
                </Form.Item>
                <Form.Item label="Date CheckedIn">
                  <DatePicker
                    style={{ width: "100%" }}
                    placeholder="Date CheckedIn"
                  />
                </Form.Item>
                <Form.Item label="Date CheckedOut">
                  <DatePicker
                    style={{ width: "100%" }}
                    placeholder="Date CheckedOut"
                  />
                </Form.Item>
              </Form>
            </Spin>
          ) : (
            <Form
              ref={formRef}
              form={form}
              labelCol={{ span: 8 }}
              labelAlign="left"
              wrapperCol={{ span: 20 }}
              style={{ width: "100%" }}
              labelWrap={true}
            >
              <Form.Item
                name="solution"
                label="Solution of incident"
                rules={[{ required: true, min: 3, max: 2000 }]}
              >
                <Input placeholder="Solution of incident" allowClear />
              </Form.Item>
              <Form.Item
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
                  disabledDate={(current) =>
                    appointment.dateAppointed !== undefined &&
                    current.isBefore(dayjs(form.getFieldValue("dateCheckedIn")))
                  }
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
          )}
        </div>
      </Modal>
    </>
  );
};

export default ModalResolveIncident;
