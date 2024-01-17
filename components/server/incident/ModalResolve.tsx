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
import {
  Incident,
  IncidentResolve,
  IncidentResolveModel,
} from "@models/incident";
import incidentService from "@services/incident";
import { useSession } from "next-auth/react";

const { confirm } = Modal;

interface Props {
  incidentDetail: Incident;
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const ModalResolve: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { data: session } = useSession();
  const { onSubmit, onClose, open, incidentDetail } = props;

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

  const resolveIncident = async (data: IncidentResolveModel) => {
    setLoading(true);
    await incidentService
      .resolveIncident(
        session?.user.access_token!,
        parseInt(incidentDetail?.id + ""),
        data
      )
      .then((res) => {
        message.success("Resolve Incident successfully!", 1.5);
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
        title={<span className="inline-block m-auto">Resolve Incident</span>}
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
                  title: "Do you want to resolve incident?",
                  async onOk() {
                    const data = {
                      solution: form.getFieldValue("solution"),
                    } as IncidentResolveModel;
                    resolveIncident(data);
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
          <Spin spinning={loading} tip="Denying request..." size="large">
            <Form
              ref={formRef}
              form={form}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ width: "100%" }}
            >
              <Form.Item
                name="solution"
                label="Solution"
                rules={[{ required: true }]}
              >
                <Input placeholder="Solution" allowClear />
              </Form.Item>
            </Form>
          </Spin>
        </div>
      </Modal>
    </>
  );
};

export default ModalResolve;
