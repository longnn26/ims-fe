import React, { useRef, useState, useEffect } from "react";
import { Button, Input, Modal, Select, Space, Card } from "antd";
import { Form } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { UserUpdateRole, User } from "@models/user";
import useSelector from "@hooks/use-selector";
const { Option } = Select;
const { confirm } = Modal;

interface Props {
  open: boolean;
  isDelete: boolean;
  onClose: () => void;
  data: User | undefined;
  onSubmit: (uUpdate: UserUpdateRole) => void;
}

const ModalUpdateRole: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { onSubmit, open, onClose, data, isDelete } = props;

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

  const setFieldsValueInitial = () => {
    if (formRef.current) {
      const initialValues = {
        id: data?.id,
        userName: data?.userName,
        fullname: data?.fullname,
        positions:
          data?.positions?.map((position, index) => ({
            roleName: getRoleNameFromPosition(position),
            key: index.toString(),
          })) || [], // Provide an empty array as a default value if data?.positions is undefined
      };
      form.setFieldsValue(initialValues);
    }
  };

  const getRoleNameFromPosition = (position: string) => {
    if (position === "Sale") {
      return "Sales Staff";
    }
    if (position === "Tech") {
      return "Technical Staff";
    }
    if (position === "Admin") {
      return "Administrator";
    }
  };

  const mapRoleName = (originalRoleName) => {
    switch (originalRoleName) {
      case "Sales Staff":
        return "Sale";
      case "Technical Staff":
        return "Tech";
      case "Administrator":
        return "Admin";
    }
  };

  useEffect(() => {
    // refresh after submit for fileList
    if (data && formRef.current) {
      setFieldsValueInitial();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <>
      <Modal
        title={
          <span className="inline-block m-auto">
            Update staff account information
          </span>
        }
        open={open}
        confirmLoading={confirmLoading}
        onCancel={() => {
          onClose();
          setFieldsValueInitial();
        }}
        footer={[
          <Button
            className="btn-submit"
            key="submit"
            onClick={async () => {
              if (!(await disabled()))
                confirm({
                  title: "Do you want to save?",
                  async onOk() {
                    let formData: UserUpdateRole = {
                      id: data?.id!,
                      roles: [],
                    };
                    if (!isDelete) {
                      const selectedRoles = form
                        .getFieldValue("positions")
                        .map((position) => mapRoleName(position.roleName));
                      const submitRoles = selectedRoles.filter(
                        (role) => !data?.positions.includes(role)
                      )!;
                      formData.roles = submitRoles || [];
                    } else if (isDelete) {
                      const selectedRoles = form
                        .getFieldValue("positions")
                        .map((position) => mapRoleName(position.roleName));
                      const submitRoles = data?.positions.filter(
                        (position) => !selectedRoles.includes(position)
                      );
                      formData.roles = submitRoles || [];
                    }
                    onSubmit(formData);
                    form.resetFields();
                  },
                  onCancel() {},
                });
            }}
          >
            Update
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
            <Form.Item label="Username" name="userName">
              <Input readOnly />
            </Form.Item>
            <Form.Item label="Fullname" name="fullname">
              <Input readOnly />
            </Form.Item>
            <Form.List name="positions">
              {(fields, { add, remove }) => (
                <div
                  style={{
                    display: "flex",
                    rowGap: 16,
                    flexDirection: "column",
                  }}
                >
                  {fields.map((field, index) => (
                    <Card
                      size="small"
                      title={`Position ${field.name + 1}`}
                      key={field.key}
                      extra={
                        index >= data?.positions.length! || isDelete ? (
                          <CloseOutlined
                            onClick={() => {
                              remove(field.name);
                            }}
                          />
                        ) : null
                      }
                    >
                      <Form.Item
                        label="Position"
                        name={[field.name, "roleName"]}
                        rules={[
                          {
                            required: true,
                            message: "Please select a position",
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              const selectedRoles = getFieldValue("positions")
                                .filter((position, i) => i < index) // Filter only the previous positions
                                .map((position) => position.roleName);

                              if (
                                !value ||
                                selectedRoles.indexOf(value) === -1
                              ) {
                                return Promise.resolve();
                              }
                              return Promise.reject("Position must be unique");
                            },
                          }),
                        ]}
                      >
                        {isDelete ? (
                          <Input readOnly />
                        ) : (
                          <Select>
                            <Option value="Sales Staff">Sales Staff</Option>
                            <Option value="Technical Staff">
                              Technical Staff
                            </Option>
                            <Option value="Administrator">Administrator</Option>
                          </Select>
                        )}
                      </Form.Item>
                    </Card>
                  ))}
                  {!isDelete &&
                    fields.length < 3 && ( // Limit max selected roles to 3
                      <Button type="dashed" onClick={() => add()} block>
                        + Add Position
                      </Button>
                    )}
                </div>
              )}
            </Form.List>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ModalUpdateRole;
