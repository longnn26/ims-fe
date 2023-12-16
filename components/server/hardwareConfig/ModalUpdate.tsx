import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Modal, Select, Card } from "antd";
import { Form } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import {
  SHCUpdateModel,
  ServerHardwareConfig,
} from "@models/serverHardwareConfig";
import useSelector from "@hooks/use-selector";
const { Option } = Select;
const { confirm } = Modal;

interface Props {
  open: boolean;
  serverHardwareConfig: ServerHardwareConfig;
  onClose: () => void;
  onSubmit: (saCreateModel: SHCUpdateModel) => void;
}

const ModalUpdate: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { onSubmit, serverHardwareConfig, onClose, open } = props;

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
  const showAllDescriptions = () => {
    const descriptions = form.getFieldValue("descriptions");
  };

  const setFieldsValueInitial = () => {
    var component = componentOptions.find(
      (_) => _.id === serverHardwareConfig.component?.id
    );

    if (formRef.current) {
      form.setFieldsValue({
        id: serverHardwareConfig.id,
        component: `${serverHardwareConfig.component.name} - ${
          serverHardwareConfig.component.isRequired == true
            ? "Required"
            : "Optional"
        } ${
          serverHardwareConfig.component.requireCapacity == true
            ? "- Capacity Required"
            : ""
        } `,
        serverAllocationId: serverHardwareConfig.serverAllocationId,
      });

      const requireCapacity = component?.requireCapacity || false;

      const descriptions = serverHardwareConfig.descriptions?.map(
        (description, index) => ({
          serialNumber: description.serialNumber,
          model: description.model,
          capacity: description.capacity,
          description: description.description,
        })
      );

      form.setFieldsValue({
        descriptions: descriptions || [],
        requireCapacity: requireCapacity,
      });
    }
  };

  useEffect(() => {
    // refresh after submit for fileList
    if (serverHardwareConfig && formRef.current) {
      setFieldsValueInitial();
      showAllDescriptions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverHardwareConfig]);

  return (
    <>
      <Modal
        title={
          <span className="inline-block m-auto">Update hardware config</span>
        }
        open={open}
        confirmLoading={confirmLoading}
        onCancel={() => {
          onClose();
          setFieldsValueInitial();
          showAllDescriptions();
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
                      descriptions: form
                        .getFieldValue("descriptions")
                        .map((item, index) => ({
                          serialNumber: form.getFieldValue([
                            "descriptions",
                            index,
                            "serialNumber",
                          ]),
                          model: form.getFieldValue([
                            "descriptions",
                            index,
                            "model",
                          ]),
                          capacity: form.getFieldValue([
                            "descriptions",
                            index,
                            "capacity",
                          ]),
                          description: form.getFieldValue([
                            "descriptions",
                            index,
                            "description",
                          ]),
                        })),
                      componentId: serverHardwareConfig.component.id,
                      id: serverHardwareConfig.id,
                    } as SHCUpdateModel;

                    // Call the provided onSubmit function with the formData
                    onSubmit(formData);
                    //form.resetFields();
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
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, component) {
                    const isRequired =
                      getFieldValue("component").isRequired === true;
                    const hasDescriptions =
                      getFieldValue("descriptions")?.length > 0;
                    if (isRequired && !hasDescriptions) {
                      return Promise.reject(
                        "At least one description is required for the selected component."
                      );
                    }

                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Input readOnly />
            </Form.Item>
            <Form.List name="descriptions">
              {(fields, { add, remove }) => (
                <div
                  style={{
                    display: "flex",
                    rowGap: 16,
                    flexDirection: "column",
                  }}
                >
                  {fields.map((field) => (
                    <Card
                      size="small"
                      title={`Hardware ${field.name + 1}`}
                      key={field.key}
                      extra={
                        fields.length > 1 && (
                          <CloseOutlined
                            onClick={() => {
                              remove(field.name);
                            }}
                          />
                        )
                      }
                    >
                      <Form.Item
                        label="Serial Number"
                        name={[field.name, "serialNumber"]}
                        rules={[{ required: true, min: 20, max: 255 }]}
                      >
                        <Input.TextArea
                          autoSize={{ minRows: 1, maxRows: 6 }}
                          allowClear
                          placeholder="Serial Number"
                        />
                      </Form.Item>
                      <Form.Item
                        label="Model Name"
                        name={[field.name, "model"]}
                        rules={[{ required: true, min: 8, max: 255 }]}
                      >
                        <Input.TextArea
                          autoSize={{ minRows: 1, maxRows: 6 }}
                          allowClear
                          placeholder="Model Name"
                        />
                      </Form.Item>
                      {form.getFieldValue(["requireCapacity"]) && (
                        <Form.Item
                          label="Capacity (GB)"
                          name={[field.name, "capacity"]}
                          rules={[
                            {
                              required: true,
                              message: "Capacity is required",
                            },
                            {
                              pattern: new RegExp(/^[0-9]+$/),
                              message:
                                "Capacity must be a number greater than 0",
                            },
                          ]}
                        >
                          <Input allowClear placeholder="Capacity (GB)" />
                        </Form.Item>
                      )}
                      <Form.Item
                        label="Description"
                        name={[field.name, "description"]}
                        rules={[{ max: 2000 }]}
                      >
                        <Input allowClear placeholder="Description" />
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

export default ModalUpdate;
