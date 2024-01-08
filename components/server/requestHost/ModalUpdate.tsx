import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Form, Input, Modal, Select, Space, Spin, message } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { areInArray } from "@utils/helpers";
import { RequestHostUpdateModel } from "@models/requestHost";
import { useSession } from "next-auth/react";
import { ROLE_CUSTOMER, ROLE_SALES, ROLE_TECH } from "@utils/constants";
import requestHostService from "@services/requestHost";
import serverAllocation from "@services/serverAllocation";

const { Option } = Select;
const { confirm } = Modal;

interface Props {
  open: boolean;
  requestHost: RequestHostUpdateModel | undefined;
  onClose: () => void;
  onSubmit: () => void;
}

const ModalUpdate: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { onSubmit, requestHost, onClose, open } = props;
  const { data: session } = useSession();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [hiddenQuantity, setHiddenQuantity] = useState(false);
  const [requestType, setRequestType] = useState<string | undefined>(undefined);
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
    if (formRef.current && requestHost) {
      const initialValues = {
        id: requestHost.id,
        note: requestHost.note,
        saleNote: requestHost.saleNote,
        techNote: requestHost.techNote,
        quantity: requestHost.quantity,
        type: requestHost.type,
        // capacities: requestHost?.capacities || [],
        capacities: requestHost?.capacities?.map((cap) => ({
          port: cap,
        })) || [],
      };
      form.setFieldsValue(initialValues);
      console.log(initialValues.capacities)
    }
  };

  useEffect(() => {
    setFieldsValueInitial();
    setHiddenQuantity(form.getFieldValue("type") === "Port");
  }, [requestHost, requestType]);

  useEffect(() => {
    setFieldsValueInitial();
    setHiddenQuantity(form.getFieldValue("type") === "Port");
  }, [open]);

  return (
    <>
      <Modal
        title={<span className="inline-block m-auto">Update IP Request</span>}
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
              if (!(await disabled())) {
                confirm({
                  title: "Do you want to save?",
                  async onOk() {
                    const data = {
                      id: form.getFieldValue("id"),
                      saleNote: form.getFieldValue("saleNote"),
                      techNote: form.getFieldValue("techNote"),
                      quantity: form.getFieldValue("type") === "Port"
                        ? form.getFieldValue("capacities").length
                        : form.getFieldValue("quantity"), // Cập nhật quantity
                      note: form.getFieldValue("note"),
                      type: form.getFieldValue("type"),
                      capacities:form.getFieldValue("capacities")?.map((value) => (value.port)) || [],
                    } as RequestHostUpdateModel;
                    setLoading(true);
                    await requestHostService
                      .updateData(session?.user.access_token!, data)
                      .then(async (res) => {
                        message.success("Update successfully!", 1.5);
                        form.resetFields();
                        onClose();
                      })
                      .catch((errors) => {
                        message.error(errors.response.data, 1.5);
                      })
                      .finally(() => {
                        onSubmit();
                        setLoading(false);
                      });
                  },
                  onCancel() { },
                });
              }
            }}
          >
            Edit
          </Button>,
        ]}
      >
        <div className="flex max-w-md flex-col gap-4 m-auto">
          {loading === true ? (
            <>
              <Spin size="large" tip="Updating data...">
                <Form
                  ref={formRef}
                  form={form}
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  style={{ width: "100%" }}
                >
                  {!hiddenQuantity && (
                    <Form.Item
                      label="Quantity IP"
                    >
                      <Input placeholder="Quantity IP" allowClear />
                    </Form.Item>
                  )}
                  {form.getFieldValue("type") === "Port" && (
                    <Form.Item
                      label="Capacity"
                    >
                      <Form.List name="capacities">
                        {(fields, { add, remove }) => (
                          <div
                            style={{
                              display: "flex",
                              rowGap: 16,
                              flexDirection: "column",
                            }}
                          >
                            {fields.map((field, index) => (
                              <Form.Item
                                name={[field.name, "port"]}
                                label={`Port ${index + 1}`}
                                rules={[
                                  { required: true, message: "Missing capacity" },
                                ]}
                                extra={
                                  <CloseOutlined
                                    onClick={() => {
                                      remove(field.name);
                                    }}
                                  />
                                }
                              >
                                <Select
                                  placeholder="Choose Capacity"
                                  style={{ width: "250px" }}
                                >
                                  <Option value={0.1}>100 MB</Option>
                                  <Option value={1}>1 GB</Option>
                                </Select>
                              </Form.Item>
                            ))}
                            <Button type="dashed" onClick={() => add()} block>
                              + Add Capacity
                            </Button>
                          </div>
                        )}
                      </Form.List>
                    </Form.Item>
                  )}

                  {areInArray(session?.user.roles!, ROLE_SALES) && (
                    <Form.Item
                      label="Sale Note"
                    >
                      <Input placeholder="Sale Note" allowClear />
                    </Form.Item>
                  )}
                  {areInArray(session?.user.roles!, ROLE_TECH) && (
                    <Form.Item
                      label="Tech Note"
                    >
                      <Input placeholder="Tech Note" allowClear />
                    </Form.Item>
                  )}
                  {areInArray(session?.user.roles!, ROLE_CUSTOMER) && (
                    <Form.Item
                      label="Note"
                    >
                      <Input placeholder="Note" allowClear />
                    </Form.Item>
                  )}
                </Form></Spin>
            </>
          ) : (
            <>
              <Form
                ref={formRef}
                form={form}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ width: "100%" }}
              >
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
                {form.getFieldValue("type") === "Port" && (
                  <Form.Item
                    label="Capacity"
                  >
                    <Form.List name="capacities">
                      {(fields, { add, remove }) => (
                        <div
                          style={{
                            display: "flex",
                            rowGap: 16,
                            flexDirection: "column",
                          }}
                        >
                          {fields.map((field, index) => (
                            <div className="flex">
                            <Form.Item
                              name={[field.name, "port"]}
                              rules={[
                                { required: true, message: "Missing capacity" },
                              ]}
                            >
                              <Select
                                placeholder="Choose Capacity"
                                style={{ width: "250px" }}
                                className="mr-2"
                              >
                                <Option value={0.1}>100 MB</Option>
                                <Option value={1}>1 GB</Option>
                              </Select>
                            </Form.Item>                            
                            <CloseOutlined
                            className="mb-6"
                                  onClick={() => {
                                    remove(field.name);
                                  }}
                                />
                            </div>
                          ))}
                          <Button type="dashed" onClick={() => add()} block>
                            + Add Capacity
                          </Button>
                        </div>
                      )}
                    </Form.List>
                  </Form.Item>
                )}

                {areInArray(session?.user.roles!, ROLE_SALES) && (
                  <Form.Item
                    name="saleNote"
                    label="Sale Note"
                    rules={[
                      {
                        pattern: new RegExp(/^\b(\w+\W*){1,2000}\b/),
                        message: "Sale note no more than 2000 words",
                      },
                    ]}
                  >
                    <Input placeholder="Sale Note" allowClear />
                  </Form.Item>
                )}
                {areInArray(session?.user.roles!, ROLE_TECH) && (
                  <Form.Item
                    name="techNote"
                    label="Tech Note"
                    rules={[
                      {
                        pattern: new RegExp(/^\b(\w+\W*){1,2000}\b/),
                        message: "Sale note no more than 2000 words",
                      },
                    ]}
                  >
                    <Input placeholder="Tech Note" allowClear />
                  </Form.Item>
                )}
                {areInArray(session?.user.roles!, ROLE_CUSTOMER) && (
                  <Form.Item
                    name="note"
                    label="Note"
                    rules={[
                      {
                        pattern: new RegExp(/^\b(\w+\W*){1,2000}\b/),
                        message: "Sale note no more than 2000 words",
                      },
                    ]}
                  >
                    <Input placeholder="Note" allowClear />
                  </Form.Item>
                )}
              </Form>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ModalUpdate;
