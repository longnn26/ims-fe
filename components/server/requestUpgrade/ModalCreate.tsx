import React, { useRef, useState } from "react";
import { Button, Input, Modal, Select, Space, Card, message } from "antd";
import { Form } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import useSelector from "@hooks/use-selector";
import { RequestUpgradeCreateModel, RequestUpgradeUpdateModel } from "@models/requestUpgrade";
import requestUpgradeService from "@services/requestUpgrade";
import { title } from "process";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
const { Option } = Select;
const { confirm } = Modal;

interface Props {
  open: boolean;
  onClose: () => void;
  // loadingSubmit: boolean;
  onSubmit: () => void;
}

const ModalCreate: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const { data: session } = useSession();
  const router = useRouter();
  const [form] = Form.useForm();
  const { onSubmit, open, onClose } = props;

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [openModalCreate, setOpenModalCreate] = useState<boolean | undefined>(undefined);
  const { componentOptions } = useSelector((state) => state.component);

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
        title={
          <span className="inline-block m-auto">Create Hardware Upgrade request</span>
        }
        open={openModalCreate === undefined ? open : openModalCreate}
        confirmLoading={confirmLoading}
        onCancel={() => {
          onClose();
          setOpenModalCreate(undefined);
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
                    const formData = {
                      description: form.getFieldValue("description"),
                      componentId: form.getFieldValue("component"),
                      serverAllocationId: parseInt(router.query.serverAllocationId+""),
                      note: form.getFieldValue("note"),
                    } as RequestUpgradeCreateModel;
                    setLoading(true);
                    await requestUpgradeService
                      .createData(session?.user.access_token!, formData)
                      .then((res) => {
                        message.success("Create successfully!", 1.5);
                        form.resetFields();
                        setOpenModalCreate(undefined);
                        onClose();
                      })
                      .catch((errors) => {
                        setOpenModalCreate(true);
                        message.error(errors.response.data, 1.5);
                      })
                      .finally(() => {
                        onSubmit();
                        setLoading(false);
                      });
                  },
                  onCancel() { },
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
            name="dynamic_form_complex"
          >
            <Form.Item
              name="component"
              label="Component"
              rules={[
                { required: true, message: "Please select a hardware type." },
              ]}
            >
              <Select
                allowClear
                placeholder="Select a hardware type."
              >
                <Option value={1}>CPU</Option>
                <Option value={2}>Memory</Option>
                <Option value={3}>Storage</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, min: 6, max: 2000 }]}
            >
              <Input allowClear placeholder="Description" />
            </Form.Item>
            <Form.Item
              label="Note"
              name="note"
              rules={[{ max: 2000 }]}
            >
              <Input allowClear placeholder="Note" />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ModalCreate;
