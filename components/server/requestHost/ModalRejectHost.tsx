import {
  RequestHostCompleteModel,
  RequestHostRejectModel,
} from "@models/requestHost";
import requestHost from "@services/requestHost";
import { ROLE_SALES, ROLE_TECH } from "@utils/constants";
import { areInArray } from "@utils/helpers";
import { Button, Form, Input, Modal, Select, Switch, message } from "antd";
import { useSession } from "next-auth/react";
import React, { useRef, useState } from "react";
const { confirm } = Modal;
const { Option } = Select;

interface Props {
  requestHostId: number;
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const ModalRejectHost: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { open, onClose, onRefresh, requestHostId } = props;
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

  const rejectRequestHost = async (data: RequestHostRejectModel) => {
    setConfirmLoading(true);
    await requestHost
      .rejectRequestHost(session?.user.access_token!, requestHostId, data)
      .then((res) => {
        message.success("Reject IP Request successfully!", 1.5);
        onRefresh();
        onClose();
        form.resetFields();
      })
      .catch((errors) => {
        message.error(errors.response.data, 1.5);
      })
      .finally(() => {
        setConfirmLoading(false);
      });
  };

  return (
    <>
      <Modal
        title={<span className="inline-block m-auto">Reject IP Request</span>}
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
                  title: "Do you want to save?",
                  async onOk() {
                    rejectRequestHost({
                      note: form.getFieldValue("note"),
                      saleNote: form.getFieldValue("saleNote"),
                      techNote: form.getFieldValue("techNote"),
                    } as RequestHostRejectModel);
                  },
                  onCancel() {},
                });
            }}
          >
            Reject
          </Button>,
        ]}
      >
        <div className="flex max-w-md flex-col gap-4 m-auto">
          <Form
            ref={formRef}
            form={form}
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 14 }}
            style={{ width: "100%" }}
          >
            {areInArray(session?.user.roles!, ROLE_TECH) && (
              <Form.Item
                name="techNote"
                label="Tech note"
                rules={[{ required: true, min: 6, max: 255 }]}
              >
                <Input placeholder="Tech note" allowClear />
              </Form.Item>
            )}
            {areInArray(session?.user.roles!, ROLE_SALES) && (
              <Form.Item
                name="saleNote"
                label="Sales note"
                rules={[{ required: true, min: 6, max: 255 }]}
              >
                <Input placeholder="Sales note" allowClear />
              </Form.Item>
            )}
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ModalRejectHost;
