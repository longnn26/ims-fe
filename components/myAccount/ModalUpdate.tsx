import React, { useRef, useState, useEffect } from "react";
import { Button, Input, Modal, Select, Space, Card, message } from "antd";
import { Form } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { UserUpdateModel, User } from "@models/user";
import useSelector from "@hooks/use-selector";
import { ChangePassword, Customer } from "@models/customer";
import customerService from "@services/customer";
import { useSession } from "next-auth/react";
const { Option } = Select;
const { confirm } = Modal;

interface Props {
  isCustomer: boolean;
  open: boolean;
  onClose: () => void;
  dataStaff: User | undefined;
  dataCust: Customer | undefined;
  onSubmit: () => void;
}

const ModalUpdate: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const { data: session } = useSession();
  const [form] = Form.useForm();
  const { onSubmit, open, onClose, dataStaff, dataCust, isCustomer } = props;

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [openModalCreate, setOpenModalCreate] = useState<boolean | undefined>(
    undefined
  );

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
          <span className="inline-block m-auto">Update your password</span>
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
            className="btn-submit"
            key="submit"
            onClick={async () => {
              if (!(await disabled()))
                confirm({
                  cancelText: "Hủy",
                  okText: "Xác nhận",
                  title: "Bạn có chắc muốn thay đổi mật khẩu?",
                  async onOk() {
                    setLoadingSubmit(true);
                    if (isCustomer === true) {
                      await customerService
                        .changePassword(session?.user.access_token!, {
                          email: session?.user.email,
                          currentPassword: form.getFieldValue("currentPass"),
                          newPassword: form.getFieldValue("password"),
                        } as ChangePassword)
                        .then((res) => {
                          message.success("Update password successfully!", 1.5);
                          form.resetFields();
                          setOpenModalCreate(undefined);
                          onClose();
                        })
                        .catch((errors) => {
                          setOpenModalCreate(true);
                          message.error(errors.response.data, 1.5);
                        })
                        .finally(() => {
                          setLoadingSubmit(false);
                        });
                    } else {
                      //chưa có api
                      // await user.changePassword(
                      //     session?.user.access_token!,
                      //     form.getFieldValue("currentPass"),
                      //     form.getFieldValue("password")
                      // ).then((res) => {
                      //     message.success("Create successfully!");
                      //     form.resetFields();
                      //     setOpenModalCreate(undefined);
                      //     onClose();
                      // })
                      //     .catch((errors) => {
                      //         setOpenModalCreate(true);
                      //         message.error(errors.response.data);
                      //     })
                      //     .finally(() => {
                      //         setLoadingSubmit(false);
                      //     });
                    }
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
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 16 }}
            style={{ width: "100%" }}
          >
            <Form.Item
              name="currentPass"
              label="Current Password"
              rules={[{ required: true, type: "string", min: 6, max: 25 }]}
              // rules={[{ required: true, type: "string", min: 8, max: 25 }]}
            >
              <Input.Password placeholder="Your Password" className="h-9" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, min: 8, max: 25 },
                {
                  pattern: /^(?=.*[A-Z])/gm,
                  message: "Password must have at least 1 uppercase letter",
                },
                {
                  pattern: /^(?=.*[a-z])/gm,
                  message: "Password must have at least 1 lowercase letter",
                },
                {
                  pattern: /^(?=.*\d)/gm,
                  message: "Password must have at least 1 number",
                },
                {
                  pattern: /^(?=.*[@$!%*?&#^\/])/gm,
                  message: "Password must have at least 1 special character",
                },
                {
                  validator: async (_, value) => {
                    if (value) {
                      if (value === form.getFieldValue("currentPass")) {
                        return Promise.reject(
                          new Error(
                            "The password must be different to the current password!"
                          )
                        );
                      } else if (value === "Password@123")
                        return Promise.reject(
                          new Error(
                            "The password must be different to the default password!"
                          )
                        );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input.Password
                placeholder="Password"
                type="password"
                className="h-9"
              />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label="Confirm new password"
              rules={[
                { required: true, type: "string", min: 8, max: 25 },
                {
                  validator: async (_, value) => {
                    if (value && value !== form.getFieldValue("password")) {
                      return Promise.reject(
                        new Error("The confirm password is not match!")
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input
                placeholder="Confirm password"
                type="password"
                className="h-9"
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ModalUpdate;
