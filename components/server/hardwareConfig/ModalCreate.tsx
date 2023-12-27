import React, { useRef, useState } from "react";
import { Button, Input, Modal, Select, Space, Card } from "antd";
import { Form } from "antd";
import { CloseOutlined } from '@ant-design/icons';
import { SHCCreateModel } from "@models/serverHardwareConfig";
import useSelector from "@hooks/use-selector";
const { Option } = Select;
const { confirm } = Modal;

interface Props {
  open: boolean;
  onClose: () => void;
  // loadingSubmit: boolean;
  onSubmit: (saCreateModel: SHCCreateModel) => void;
}

const ModalCreate: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { onSubmit, open, onClose } = props;

  const [confirmLoading, setConfirmLoading] = useState(false);
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
          <span className="inline-block m-auto">Create hardware config</span>
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
                      descriptions: form.getFieldValue('descriptions').map((item, index) => ({
                        serialNumber: form.getFieldValue(['descriptions', index, 'serialNumber']),
                        model: form.getFieldValue(['descriptions', index, 'model']),
                        capacity: form.getFieldValue(['descriptions', index, 'capacity']),
                        description: form.getFieldValue(['descriptions', index, 'description']),
                      })),
                      componentId: form.getFieldValue('component').value,
                    } as SHCCreateModel;

                    // Call the provided onSubmit function with the formData
                    onSubmit(formData);
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
                { required: true, message: 'Please select a component.' },
                ({ getFieldValue }) => ({
                  validator(_, component) {
                    const isRequired = getFieldValue("component").isRequired === true;
                    const hasDescriptions = getFieldValue('descriptions')?.length > 0;
                    if (isRequired && !hasDescriptions) {
                      return Promise.reject('At least one description is required for the selected component.');
                    }

                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Select
                allowClear
                onSelect={(value, option) => {
                  form.setFieldsValue({
                    component: {
                      value: value,
                      label: option.label,
                      isRequired: option.isRequired,
                      requireCapacity: option.requireCapacity,
                    },
                  });
                }}
              >
                {componentOptions.map((l, index) => (
                  <Option 
                    value={l.id}
                    label={`${l.name} - ${l.isRequired == true ? "Required" : "Optional"} ${l.requireCapacity == true ? " - Capacity Required" : ""}`}
                    key={index} 
                    isRequired={l?.isRequired}
                    requireCapacity={l?.requireCapacity}
                  >
                    {`${l.name} - ${l.isRequired == true ? "Required" : "Optional"} ${l.requireCapacity == true ? " - Capacity Required" : ""}`}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.List name="descriptions">
              {(fields, { add, remove }) => (
                <div style={{ display: 'flex', rowGap: 16, flexDirection: 'column' }}>
                  {fields.map((field) => (
                    <Card
                      size="small"
                      title={`Hardware ${field.name + 1}`}
                      key={field.key}
                      extra={
                        <CloseOutlined
                          onClick={() => {
                            remove(field.name);
                          }}
                        />
                      }
                    >
                      <Form.Item
                        label="Serial Number"
                        name={[field.name, 'serialNumber']}
                        rules={[{ required: true, min: 20, max: 255 }]}>
                        <Input.TextArea
                          autoSize={{ minRows: 1, maxRows: 6 }}
                          allowClear
                          placeholder="Serial Number"
                        />
                      </Form.Item>
                      <Form.Item
                        label="Model Name"
                        name={[field.name, 'model']}
                        rules={[{ required: true, min: 8, max: 255 }]}>
                        <Input.TextArea
                          autoSize={{ minRows: 1, maxRows: 6 }}
                          allowClear
                          placeholder="Model Name"
                        />
                      </Form.Item>
                      {form.getFieldValue(['component', 'requireCapacity']) && (
                        <Form.Item
                          label="Capacity (GB)"
                          name={[field.name, 'capacity']}
                          rules={[
                            {
                              required: true,
                              message: 'Capacity is required',
                            },
                            {
                              pattern: new RegExp(/^[0-9]+$/),
                              message: 'Capacity must be a number greater than 0',
                            },
                          ]}
                        >
                          <Input
                            allowClear
                            placeholder="Capacity (GB)"
                          />
                        </Form.Item>
                      )}
                      <Form.Item
                        label="Description"
                        name={[field.name, 'description']}
                        rules={[
                          { max: 2000 },
                        ]}
                      >
                        <Input
                          allowClear
                          placeholder="Description"
                        />
                      </Form.Item>
                    </Card>
                  ))}

                  <Button type="dashed" onClick={() => add()} block>
                    + Add Hardware
                  </Button>
                </div>
              )}
            </Form.List>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ModalCreate;
