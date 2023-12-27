import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Modal, Select, Space, Card } from "antd";
import { Form } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import useSelector from "@hooks/use-selector";
import { RequestUpgradeRemoveModel } from "@models/requestUpgrade";
import serverHardwareConfigService from "@services/serverHardwareConfig";
import { title } from "process";
import {
  SHCParamGet,
  ServerHardwareConfig,
} from "@models/serverHardwareConfig";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ServerAllocation } from "@models/serverAllocation";
const { Option } = Select;
const { confirm } = Modal;

interface Props {
  open: boolean;
  server: ServerAllocation;
  onClose: () => void;
  // loadingSubmit: boolean;
  onSubmit: (saCreateModel: RequestUpgradeRemoveModel) => void;
}

const ModalRemove: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { onSubmit, open, onClose, server } = props;
  const { data: session, update: sessionUpdate } = useSession();
  const router = useRouter();

  const [confirmLoading, setConfirmLoading] = useState(false);
  const { componentOptions } = useSelector((state) => state.component);
  const [serverHardwareConfig, setServerHardwareConfig] = useState<
    ServerHardwareConfig[]
  >([]);
  const [pageSizeCus, setPageSizeCus] = useState<number>(6);
  const [totalPageUp, setTotalPageUp] = useState<number>(2);
  const [pageIndexUp, setPageIndexUp] = useState<number>(0);

  const getMoreServerHardwareConfig = async (
    serverId: number,
    pageIndex?: number,
    req?: ServerHardwareConfig[]
  ) => {
    await serverHardwareConfigService
      .getServerHardwareConfigData(session?.user.access_token!, {
        PageIndex: pageIndex === 0 ? pageIndex : pageIndexUp + 1,
        PageSize: pageSizeCus,
        ServerAllocationId: serverId,
      } as SHCParamGet)
      .then(async (data) => {
        setTotalPageUp(data.totalPage);
        setPageIndexUp(data.pageIndex);
        req
          ? setServerHardwareConfig([...req, ...data.data])
          : setServerHardwareConfig([...serverHardwareConfig, ...data.data]);
      });
  };

  const disabled = async () => {
    var result = false;
    try {
      await form.validateFields();
    } catch (errorInfo) {
      result = true;
    }
    return result;
  };

  useEffect(() => {
    if (session) {
      getMoreServerHardwareConfig(server.id, 0, []);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return (
    <>
      <Modal
        title={
          <span className="inline-block m-auto">
            Submit Hardware Remove Request
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
            onClick={async () => {
              if (!(await disabled()))
                confirm({
                  title: "Do you want to save?",
                  async onOk() {
                    const formData = {
                      descriptions: null,
                      componentId: form.getFieldValue("component").value,
                    } as RequestUpgradeRemoveModel;

                    // Call the provided onSubmit function with the formData
                    onSubmit(formData);
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
            name="dynamic_form_complex"
          >
            <Form.Item
              name="component"
              label="Component"
              labelAlign="right"
              rules={[
                { required: true, message: "Please select a component." },
              ]}
            >
              <Select
                placeholder="Please select a Hardware"
                allowClear
                onPopupScroll={async (e: any) => {
                  const { target } = e;
                  if (
                    (target as any).scrollTop + (target as any).offsetHeight ===
                    (target as any).scrollHeight
                  ) {
                    if (pageIndexUp < totalPageUp) {
                      getMoreServerHardwareConfig(server.id);
                    }
                  }
                }}
              >
                {serverHardwareConfig
                  .filter((l) => l.component.isRequired === false)
                  .map((l, index) => (
                    <Option value={l.id} key={index}>
                      {l?.component.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ModalRemove;
