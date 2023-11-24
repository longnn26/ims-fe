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
  onClose: () => void;
  onSubmit: (data: string) => void;
}

const ModalFail: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { onSubmit, onClose, open } = props;

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
            onClick={async () => {
              if (!(await disabled()))
                confirm({
                  title: "Do you want to fail appointment?",
                  async onOk() {
                    onSubmit(form.getFieldValue("note"));
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
            <Form.Item name="note" label="Note" rules={[{ required: true }]}>
              <Input placeholder="Note" allowClear />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ModalFail;
