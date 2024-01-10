import requestExpand from "@services/requestExpand";
import requestHost from "@services/requestHost";
import requestUpgrade from "@services/requestUpgrade";
import { Button, Form, Input, Modal, message } from "antd";
import { useSession } from "next-auth/react";
import React, { useRef, useState } from "react";
const { confirm } = Modal;

interface Props {
  open: boolean;
  onClose: () => void;
  getData: () => void;
  requestUpgradeId: number;
}

const ModalDenyHost: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { open, onClose, requestUpgradeId, getData } = props;
  const { data: session } = useSession();

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
        title={<span className="inline-block m-auto">Deny Hardware Upgrade request</span>}
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
            onClick={async () => {
              if (!(await disabled()))
                confirm({
                  title: "Do you want to deny?",
                  async onOk() {
                    await requestUpgrade
                      .denyRequestUpgrade(
                        session?.user.access_token!,
                        requestUpgradeId + "",
                        form.getFieldValue("saleNote")
                      )
                      .then((res) => {
                        message.success("Deny IP Request successfully!", 1.5);
                        getData();
                        onClose();
                      })
                      .catch((errors) => {
                        message.error(errors.response.data, 1.5);
                      })
                      .finally(() => {});
                    form.resetFields();
                  },
                  onCancel() {},
                });
            }}
          >
            Deny
          </Button>,
        ]}
      >
        <div className="flex max-w-md flex-col gap-4 m-auto">
          <Form
            ref={formRef}
            form={form}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 20 }}
            style={{ width: "100%" }}
          >
            <Form.Item
              name="saleNote"
              label="Sale note for failure"
              rules={[{ required: true }]}
            >
              <Input placeholder="Note" allowClear />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ModalDenyHost;
