import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Modal, Select, Card, Spin, message } from "antd";
import { Form } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import {
  SHCCreateModel,
  SHCUpdateModel,
  ServerHardwareConfig,
  ServerHardwareConfigData,
} from "@models/serverHardwareConfig";
import serverHardwareConfigService from "@services/serverHardwareConfig";
import useSelector from "@hooks/use-selector";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
const { Option } = Select;
const { confirm } = Modal;

interface Props {
  open: boolean;
  serverHardwareConfig: ServerHardwareConfigData;
  onClose: () => void;
  onSubmit: () => void;
}

const ModalUpdate: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const router = useRouter();
  const { data: session } = useSession();
  const { onSubmit, serverHardwareConfig, onClose, open } = props;

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [openModalCreate, setOpenModalCreate] = useState<boolean | undefined>(
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

  const setFieldsValueInitial = () => {
    if (formRef.current) {
      form.setFieldsValue({
        cpu: serverHardwareConfig.data.find((c) => c.componentId === 1)
          ?.description,
        ram: serverHardwareConfig.data.find((c) => c.componentId === 2)
          ?.description,
        harddisk: serverHardwareConfig.data.find((c) => c.componentId === 3)
          ?.description,
      });
    }
  };

  useEffect(() => {
    // refresh after submit for fileList
    if (serverHardwareConfig && formRef.current) {
      setFieldsValueInitial();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverHardwareConfig]);

  return (
    <>
      <Modal
        title={
          <span className="inline-block m-auto">
            Update Hardware Information
          </span>
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
                    //đợi api ròi sửa khúc submit
                    const formData = {
                      cpu: form.getFieldValue("cpu"),
                      ram: form.getFieldValue("ram"),
                      harddisk: form.getFieldValue("harddisk"),
                      serverAllocationId: parseInt(
                        router.query.serverAllocationId + ""
                      ),
                    } as SHCCreateModel;
                    setLoading(true);
                    await serverHardwareConfigService
                      .createServerHardwareConfig(
                        session?.user.access_token!,
                        formData
                      )
                      .then((res) => {
                        form.resetFields();
                        setOpenModalCreate(undefined);
                        onClose();
                        message.success("Update successfully!", 1.5);
                      })
                      .catch((errors) => {
                        setOpenModalCreate(true);
                        message.error(errors.response.data, 1.5);
                      })
                      .finally(() => {
                        setLoading(false);
                        onSubmit();
                      });
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
          {loading === true && (
            <>
              <Spin size="large" tip="Adding hardware information">
                <Form
                  ref={formRef}
                  form={form}
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  style={{ width: "100%" }}
                  name="dynamic_form_complex"
                >
                  <Form.Item label="CPU" labelAlign="left">
                    <Input.TextArea />
                  </Form.Item>
                  <Form.Item labelAlign="left" label="Memory">
                    <Input.TextArea />
                  </Form.Item>
                  <Form.Item labelAlign="left" label="Storage">
                    <Input.TextArea />
                  </Form.Item>
                </Form>
              </Spin>
            </>
          )}
          {loading === false && (
            <Form
              ref={formRef}
              form={form}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              style={{ width: "100%" }}
              name="dynamic_form_complex"
            >
              <Form.Item
                name="cpu"
                label="CPU"
                labelAlign="left"
                rules={[{ required: true, min: 3, max: 255 }]}
              >
                <Input.TextArea
                  placeholder="CPU"
                  autoSize={{ minRows: 1, maxRows: 6 }}
                  allowClear
                />
              </Form.Item>
              <Form.Item
                name="ram"
                labelAlign="left"
                label="Memory"
                rules={[{ required: true, min: 3, max: 255 }]}
              >
                <Input.TextArea
                  placeholder="Memory"
                  autoSize={{ minRows: 1, maxRows: 6 }}
                  allowClear
                />
              </Form.Item>
              <Form.Item
                name="harddisk"
                labelAlign="left"
                label="Storage"
                rules={[{ required: true, min: 3, max: 255 }]}
              >
                <Input.TextArea
                  placeholder="Storage"
                  autoSize={{ minRows: 1, maxRows: 6 }}
                  allowClear
                />
              </Form.Item>
            </Form>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ModalUpdate;
