import { Alert, Button, Form, Input, Modal, Spin, message } from "antd";

import { useSession } from "next-auth/react";
import React, { useRef, useState } from "react";
import requestUpgradeService from "@services/requestUpgrade";
import { useRouter } from "next/router";
const { confirm } = Modal;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  requestUpgradeId: number;
}

const ModalAcceptUpgrade: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { open, onClose, requestUpgradeId, onSubmit } = props;
  const { data: session } = useSession();
  const router = useRouter();
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

  const accept = async (data: string) => {
    setLoading(true);
    await requestUpgradeService
      .acceptRequestUpgrade(
        session?.user.access_token!,
        requestUpgradeId + "",
        data
      )
      .then((res) => {
        message.success("Accept Hardware Upgrade Request successfully!", 1.5);
        form.resetFields();
        onSubmit();
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
        title={
          <span className="inline-block m-auto">
            Accept Hardware Upgrade Request
          </span>
        }
        open={open}
        confirmLoading={confirmLoading}
        onCancel={() => {
          onClose();
          form.resetFields();
        }}
        footer={[
          <Button
            className="btn-submit"
            key="submit"
            disabled={loading}
            onClick={async () => {
              if (!(await disabled()))
                confirm({
                  title: "Do you want to Accept this Request?",
                  async onOk() {
                    accept(form.getFieldValue("saleNote"));
                  },
                  onCancel() {},
                });
            }}
          >
            Accept
          </Button>,
        ]}
      >
        <div className="flex max-w-md flex-col gap-4 m-auto">
          <Spin spinning={loading} tip="Denying request..." size="large">
            <Form
              ref={formRef}
              form={form}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 20 }}
              style={{ width: "100%" }}
            >
              <Form.Item
                name="saleNote"
                label="Sales Staff Note "
                rules={[{ required: true, max: 2000 }]}
              >
                <Input.TextArea
                  autoSize={{ minRows: 1, maxRows: 6 }}
                  placeholder="Sales Staff Note"
                  allowClear
                />
              </Form.Item>
            </Form>
          </Spin>
        </div>
      </Modal>
    </>
  );
};

export default ModalAcceptUpgrade;
