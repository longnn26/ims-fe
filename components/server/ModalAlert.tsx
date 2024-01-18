import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Modal, Select, Spin, Switch, message } from "antd";
import { Form } from "antd";
import { SAUpdateModel, ServerAllocation } from "@models/serverAllocation";
import { optionStatus, serverAllocationStatus } from "@utils/constants";
import incident from "@services/incident";
import { useSession } from "next-auth/react";
import { error } from "console";
import { IncidentCreateModel } from "@models/incident";
const { confirm } = Modal;

interface Props {
  serverAllocation: ServerAllocation;
  onClose: () => void;
  onSubmit: () => void;
}

const ModalAlert: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { data: session } = useSession();
  const { onSubmit, serverAllocation, onClose } = props;

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
        customer: serverAllocation.customer.companyName,
        server: `${serverAllocation.serialNumber} - ${serverAllocation.status}`,
      });
  };

  useEffect(() => {
    if (serverAllocation) {
      setFieldsValueInitial();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverAllocation]);

  return (
    <>
      <Modal
        title={
          <span className="inline-block m-auto">
            {"Create Incident Notification"}
          </span>
        }
        open={Boolean(serverAllocation)}
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
                  title: "Do you want to create?",
                  async onOk() {
                    const data = {
                      serverAllocationId: serverAllocation.id,
                      description: form.getFieldValue("description"),
                      isResolvByClient: form.getFieldValue("isResolvByClient"),
                      pausingRequired: form.getFieldValue("pausingRequired"),
                    } as IncidentCreateModel;
                    setLoading(true);
                    await incident
                      .createIncident(session?.user.access_token!, data)
                      .then((res) => {
                        message.success(
                          "Create server incident warning successfully!",
                          1.5
                        );
                        onSubmit();
                        form.resetFields();
                      })
                      .catch((error) => {
                        message.error(error.response.data, 1.5);
                      })
                      .finally(() => {
                        setLoading(false);
                      });
                  },
                  onCancel() {},
                });
            }}
          >
            Create
          </Button>,
        ]}
      >
        <div className="flex max-w-md flex-col gap-4 m-auto">
          {loading === true ? (
            <>
              <Spin size="large" tip="Creating incident warning...">
                <Form
                  ref={formRef}
                  form={form}
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 20 }}
                  style={{ width: "100%" }}
                  labelWrap={true}
                >
                  <Form.Item label="Customer">
                    <Input.TextArea
                      autoSize={{ minRows: 1, maxRows: 6 }}
                      readOnly
                    />
                  </Form.Item>
                  <Form.Item label="Server">
                    <Input.TextArea
                      autoSize={{ minRows: 1, maxRows: 6 }}
                      readOnly
                    />
                  </Form.Item>
                  <Form.Item
                    label="Warning"
                    rules={[{ required: true, max: 2000 }]}
                  >
                    <Input placeholder="Incident description" allowClear />
                  </Form.Item>
                  <Form.Item label="Customer must create an appointment">
                    <Switch />
                  </Form.Item>
                  <Form.Item label="Pause the server">
                    <Switch />
                  </Form.Item>
                </Form>
              </Spin>
            </>
          ) : (
            <Form
              ref={formRef}
              form={form}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 20 }}
              style={{ width: "100%" }}
              labelWrap={true}
            >
              <Form.Item name="customer" label="Customer">
                <Input.TextArea
                  autoSize={{ minRows: 1, maxRows: 6 }}
                  readOnly
                />
              </Form.Item>
              <Form.Item name="server" label="Server">
                <Input.TextArea
                  autoSize={{ minRows: 1, maxRows: 6 }}
                  readOnly
                />
              </Form.Item>
              <Form.Item
                name="description"
                label="Warning"
                rules={[{ required: true, max: 2000 }]}
              >
                <Input placeholder="Incident description" allowClear />
              </Form.Item>
              <Form.Item
                name="isResolvByClient"
                label="Customer must create an appointment"
              >
                <Switch />
              </Form.Item>
              <Form.Item name="pausingRequired" label="Pause the server">
                <Switch />
              </Form.Item>
            </Form>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ModalAlert;
