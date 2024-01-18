import React, { useRef, useState } from "react";
import {
  Button,
  Input,
  Modal,
  Select,
  Space,
  Card,
  message,
  Upload,
  Spin,
} from "antd";
import { Form } from "antd";
import { RequestExpandCreateModel } from "@models/requestExpand";
const { Option } = Select;
const { confirm } = Modal;
import requestExpandService from "@services/requestExpand";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const ModalCreate: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const router = useRouter();
  const { data: session } = useSession();
  const [form] = Form.useForm();
  const { onSubmit, open, onClose } = props;

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

  const createData = async (data: RequestExpandCreateModel) => {
    setLoading(true);
    await requestExpandService
      .createData(session?.user.access_token!, data)
      .then((res) => {
        message.success("Create successfully!", 1.5);
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
        title={
          <span className="inline-block m-auto">
            Create Server Allocation Request
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
            // loading={loadingSubmit}
            className="btn-submit"
            key="submit"
            disabled={loading}
            onClick={async () => {
              if (!(await disabled()))
                confirm({
                  title: "Do you want to save?",
                  async onOk() {
                    const formData = {
                      forRemoval: false,
                      note: form.getFieldValue("note"),
                      serverAllocationId: parseInt(
                        router.query.serverAllocationId + ""
                      ),
                    } as RequestExpandCreateModel;

                    // Call the provided onSubmit function with the formData
                    createData(formData);
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
          <Spin spinning={loading} tip="Creating request..." size="large">
            <Form
              ref={formRef}
              form={form}
              labelCol={{ span: 6 }}
              labelWrap={true}
              wrapperCol={{ span: 20 }}
              style={{ width: "100%" }}
              name="dynamic_form_complex"
            >
              <Form.Item
                name="note"
                label="Note"
                rules={[{ required: true, max: 2000 }]}
              >
                <Input placeholder="Note" allowClear />
              </Form.Item>
            </Form>
          </Spin>
        </div>
      </Modal>
    </>
  );
};

export default ModalCreate;
