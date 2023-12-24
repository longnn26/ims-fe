import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Input, Modal, Select, Space } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { areInArray } from "@utils/helpers";
import { RequestHostUpdateModel } from "@models/requestHost";
import { useSession } from "next-auth/react";
import { ROLE_CUSTOMER, ROLE_SALES, ROLE_TECH } from "@utils/constants";

const { Option } = Select;
const { confirm } = Modal;

interface Props {
  requestHost: RequestHostUpdateModel;
  onClose: () => void;
  onSubmit: (requestHostUpdateModel: RequestHostUpdateModel) => void;
}

const ModalUpdate: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { onSubmit, requestHost, onClose } = props;
  const { data: session } = useSession();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [selectedCapacities, setSelectedCapacities] = useState<number[]>(
    (requestHost && requestHost.capacities) || []
  );
  const [hiddenQuantity, setHiddenQuantity] = useState(false);
  const [requestType, setRequestType] = useState<string | undefined>(undefined);

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
        capacities: requestHost?.capacities || [],
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    setFieldsValueInitial();
    setHiddenQuantity(form.getFieldValue("type") === "Port");
    if (requestHost) {
      setSelectedCapacities(requestHost?.capacities || []);
    }
    console.log(requestHost);
  }, [requestHost, requestType]);

  return (
    <>
      <Modal
        title={<span className="inline-block m-auto">Update IP Request</span>}
        visible={Boolean(requestHost)}
        confirmLoading={confirmLoading}
        onCancel={() => {
          onClose();
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
                    const submittedCapacities =
                      form.getFieldValue("type") === "Additional"
                        ? null
                        : selectedCapacities;

                    onSubmit({
                      id: form.getFieldValue("id"),
                      saleNote: form.getFieldValue("saleNote"),
                      techNote: form.getFieldValue("techNote"),
                      quantity: submittedCapacities
                        ? submittedCapacities.length
                        : 0, // Cập nhật quantity
                      note: form.getFieldValue("note"),
                      type: form.getFieldValue("type"),
                      capacities: submittedCapacities,
                    } as RequestHostUpdateModel);

                    form.resetFields();
                    onClose();
                  },
                  onCancel() {},
                });
              }
            }}
          >
            Edit
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
                label="Capacity (GB)"
                name="capacities"
                initialValue={selectedCapacities}
              >
                <Form.List name="capacities">
                  {(fields, { add, remove }) => (
                    <div>
                      {fields.map(({ key, name, fieldKey, ...restField }) => (
                        <Space
                          key={key}
                          style={{ display: "flex", marginBottom: 8 }}
                          align="baseline"
                        >
                          <Form.Item
                            {...restField}
                            name={[name, "value"]}
                            rules={[
                              { required: true, message: "Missing capacity" },
                            ]}
                          >
                            <Select
                              placeholder="Choose Capacity"
                              onChange={(value: number) => {
                                setSelectedCapacities((prevCapacities) => {
                                  const updatedCapacities = [...prevCapacities];
                                  updatedCapacities[
                                    fields.findIndex(
                                      (field) => field.key === key
                                    )
                                  ] = value;
                                  return updatedCapacities;
                                });
                              }}
                              style={{ width: "250px" }}
                            >
                              <Option value={0.1}>0.1</Option>
                              <Option value={1}>1</Option>
                            </Select>
                          </Form.Item>
                          <CloseOutlined onClick={() => remove(name)} />
                        </Space>
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
        </div>
      </Modal>
    </>
  );
};

export default ModalUpdate;
