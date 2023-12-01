import React, { useRef, useState } from "react";
import { Button, Input, Modal, Space, Spin, message } from "antd";
import { Form } from "antd";
import { IpSubnetCreateModel } from "@models/ipSubnet";
import { CloseOutlined } from "@ant-design/icons";
import ipSubnetService from "@services/ipSubnet";
import { useSession } from "next-auth/react";
const { confirm } = Modal;

interface Props {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const ModalCreate: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { onRefresh, open, onClose } = props;
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

  const createData = async (data: IpSubnetCreateModel) => {
    setConfirmLoading(true);
    await ipSubnetService
      .createData(session?.user.access_token!, data)
      .then((res) => {
        message.success("Create successful!");
        onRefresh();
        onClose();
        form.resetFields();
      })
      .catch((errors) => {
        message.error(errors.response.data);
      })
      .finally(() => {
        setConfirmLoading(false);
      });
  };

  return (
    <>
      <Modal
        title={<span className="inline-block m-auto">Create IP</span>}
        open={open}
        confirmLoading={confirmLoading}
        onCancel={() => {
          onClose();
          form.resetFields();
        }}
        footer={[
          <Button
            loading={confirmLoading}
            className="btn-submit"
            key="submit"
            onClick={async () => {
              if (!(await disabled()))
                confirm({
                  title: "Do you want to save?",
                  async onOk() {
                    createData({
                      ipAddresss: form.getFieldValue("ipAddresss"),
                      prefixLength: form.getFieldValue("prefixLength"),
                      note: form.getFieldValue("note"),
                      ipSubnets: form.getFieldValue("ipSubnets"),
                    } as IpSubnetCreateModel);
                  },
                  onCancel() {},
                });
            }}
          >
            Submit
          </Button>,
        ]}
      >
        <Spin spinning={confirmLoading}>
          <div className="flex max-w-md flex-col gap-4 m-auto">
            <Form
              ref={formRef}
              form={form}
              style={{ width: "100%" }}
              layout="vertical"
            >
              <Form.Item
                name="ipAddresss"
                label="Ip Addresss"
                rules={[{ required: true }]}
              >
                <Input placeholder="Ip Addresss" allowClear />
              </Form.Item>
              <Form.Item
                name="prefixLength"
                label="Prefix Length"
                rules={[
                  { required: true },
                  {
                    pattern: new RegExp(/^(?:1[6-9]|2[0-4])$/),
                    message: "PrefixLength must be a number between 16 and 24",
                  },
                ]}
              >
                <Input placeholder="Prefix Length" allowClear />
              </Form.Item>
              <Form.Item name="note" label="Note">
                <Input placeholder="Note" allowClear />
              </Form.Item>
              <Form.Item
                label="Ip Subnets"
                name="subnets"
                rules={[
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (
                        getFieldValue("ipSubnets") &&
                        getFieldValue("ipSubnets").length
                      ) {
                        return Promise.resolve();
                      }
                      return Promise.reject("Please add Ip Subnet");
                    },
                  }),
                ]}
              >
                <Form.List name="ipSubnets">
                  {(subFields, subOpt) => (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        rowGap: 16,
                      }}
                    >
                      {subFields.map((subField) => (
                        <div
                          key={subField.key}
                          className="relative p-5 bg-[#f8f9fa]/10 border border-gray-200 rounded-lg shadow-lg shadow-[#464649]/50"
                        >
                          <CloseOutlined
                            className="absolute top-4 right-2"
                            onClick={() => {
                              subOpt.remove(subField.name);
                            }}
                          />
                          <Form.Item
                            name={[subField.name, "ipAddresss"]}
                            label="Ip Addresss"
                            rules={[{ required: true }]}
                          >
                            <Input placeholder="Ip Addresss" />
                          </Form.Item>
                          <Form.Item
                            name={[subField.name, "prefixLength"]}
                            label="Prefix Length"
                            rules={[
                              { required: true },
                              {
                                pattern: new RegExp(/^(?:1[6-9]|2[0-4])$/),
                                message:
                                  "PrefixLength must be a number between 16 and 24",
                              },
                            ]}
                          >
                            <Input placeholder="Prefix Length" />
                          </Form.Item>
                          <Form.Item
                            name={[subField.name, "note"]}
                            label="Note"
                          >
                            <Input placeholder="note" />
                          </Form.Item>
                        </div>
                      ))}
                      <Button type="dashed" onClick={() => subOpt.add()} block>
                        + Add Ip Subnet
                      </Button>
                    </div>
                  )}
                </Form.List>
              </Form.Item>
            </Form>
          </div>
        </Spin>
      </Modal>
    </>
  );
};

export default ModalCreate;
