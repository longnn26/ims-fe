import React, { useRef, useState, useEffect } from "react";
import { Button, Input, Modal, Select, Space, Card, message, Spin } from "antd";
import { Form } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import useSelector from "@hooks/use-selector";
import { RequestHostCreateModel } from "@models/requestHost";
import requestHost from "@services/requestHost";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
const { Option } = Select;
const { confirm } = Modal;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const ModalCreate: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { onSubmit, open, onClose } = props;
  const { data: session } = useSession();
  const router = useRouter();

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { componentOptions } = useSelector((state) => state.component);
  const [selectedCapacities, setSelectedCapacities] = useState<number[]>([]);
  const [hiddenQuantity, setHiddenQuantity] = useState(false);
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

  const createData = async (data: RequestHostCreateModel) => {
    setLoading(true);
    await requestHost
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

  const [requestType, setRequestType] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Khi requestType thay đổi, reset selectedCapacities và hiển thị/ẩn quantity
    setSelectedCapacities([]);
    setHiddenQuantity(requestType === "Port");
  }, [requestType]);

  return (
    <>
      <Modal
        title={<span className="inline-block m-auto">Create IP Request</span>}
        open={open}
        confirmLoading={confirmLoading}
        onCancel={() => {
          onClose();
          form.resetFields();
        }}
        footer={[
          <Button
            loading={loadingSubmit}
            disabled={loading}
            className="btn-submit"
            key="submit"
            onClick={async () => {
              if (!(await disabled()))
                confirm({
                  title: "Do you want to save?",
                  async onOk() {
                    // Đặt trạng thái loading khi bắt đầu gửi dữ liệu
                    let formData: RequestHostCreateModel;

                    if (form.getFieldValue("type") === "Additional") {
                      // Nếu type là "Additional", đặt capacities là null
                      formData = {
                        type: form.getFieldValue("type"),
                        quantity: hiddenQuantity
                          ? selectedCapacities.length
                          : form.getFieldValue("quantity"),
                        capacities: null,
                        note: form.getFieldValue("note"),
                        isRemoval: false,
                      } as RequestHostCreateModel;
                    } else {
                      // Ngược lại, truyền bình thường với capacities từ selectedCapacities
                      formData = {
                        type: form.getFieldValue("type"),
                        quantity: hiddenQuantity
                          ? selectedCapacities.length
                          : form.getFieldValue("quantity"),
                        capacities: selectedCapacities,
                        note: form.getFieldValue("note"),
                        isRemoval: false,
                      } as RequestHostCreateModel;
                    }
                    formData.serverAllocationId = parseInt(
                      router.query.serverAllocationId!.toString()
                    );
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
        <Spin spinning={loading} tip="Creating request..." size="large">
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
                name="type"
                label="Request for more"
                rules={[
                  { required: true, message: "Please select a component." },
                ]}
              >
                <Select
                  placeholder="Choose Request Type"
                  allowClear
                  onChange={(value) => setRequestType(value)}
                >
                  <Option value="Additional">IP</Option>
                  <Option value="Port">Port</Option>
                </Select>
              </Form.Item>
              {!hiddenQuantity && (
                <Form.Item
                  name="quantity"
                  label="Quantity IP"
                  rules={[
                    {
                      required: true,
                    },
                    {
                      pattern: new RegExp(/^[0-9]+$/),
                      message: "Quantity IP must be a number",
                    },
                  ]}
                >
                  <Input placeholder="Quantity IP" allowClear />
                </Form.Item>
              )}
              {requestType === "Port" && (
                <Form.Item label="Capacity">
                  <Form.List name="capacities">
                    {(subFields, subOpt) => (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 16,
                        }}
                      >
                        {subFields.map((subField, index) => (
                          <Space key={subField.key}>
                            <Form.Item
                              {...subField}
                              name={[subField.name, "value"]}
                              rules={[
                                {
                                  required: true,
                                },
                                {
                                  pattern: new RegExp(/^(0(\.[1-9])?|1)$/),
                                  message: "Capacity must be 0, 0.1, or 1",
                                },
                              ]}
                            >
                              <Select
                                placeholder="Choose Capacity"
                                onChange={(value: number) => {
                                  setSelectedCapacities((prevCapacities) => {
                                    const updatedCapacities = [
                                      ...prevCapacities,
                                    ];
                                    updatedCapacities[index] = value;
                                    return updatedCapacities;
                                  });
                                }}
                                value={selectedCapacities[index]}
                                style={{ width: "250px" }}
                              >
                                <Option value={0.1}>100 Mbps</Option>
                                <Option value={1}>1 Gbps</Option>
                              </Select>
                            </Form.Item>
                            <CloseOutlined
                              style={{ paddingBottom: "25px" }}
                              onClick={() => {
                                subOpt.remove(subField.name);
                                setSelectedCapacities((prevCapacities) => {
                                  const updatedCapacities = [...prevCapacities];
                                  updatedCapacities.splice(index, 1);
                                  return updatedCapacities;
                                });
                              }}
                            />
                          </Space>
                        ))}
                        <Button
                          type="dashed"
                          onClick={() => subOpt.add()}
                          block
                        >
                          + Add Capacity
                        </Button>
                      </div>
                    )}
                  </Form.List>
                </Form.Item>
              )}
              <Form.Item name="note" label="Note">
                <Input placeholder="Note" allowClear />
              </Form.Item>
            </Form>
          </div>
        </Spin>
      </Modal>
    </>
  );
};

export default ModalCreate;
