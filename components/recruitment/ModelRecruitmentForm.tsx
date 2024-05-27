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
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const ModalRecruitmentForm: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const { data: session } = useSession();
  const [form] = Form.useForm();
  const { onSubmit, open, onClose } = props;

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

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
          <p className="inline-block m-auto text-2xl">
            Thông tin ứng viên Tài xế Taxi tại SecureRideHome
          </p>
        }
        width={1152}
        open={open}
        confirmLoading={confirmLoading}
        onCancel={() => {
          onClose();
          form.resetFields();
        }}
        footer={[
          <Button
            className="btn"
            key="submit"
            onClick={async () => {
              if (!(await disabled()))
                confirm({
                  title: "Do you want to update your password?",
                  async onOk() {
                    setLoadingSubmit(true);

                    await customerService
                      .changePassword(session?.user.access_token!, {
                        email: session?.user.email,
                        currentPassword: form.getFieldValue("currentPass"),
                        newPassword: form.getFieldValue("password"),
                      } as ChangePassword)
                      .then((res) => {
                        message.success("Update password successfully!", 1.5);
                        form.resetFields();
                        onClose();
                      })
                      .catch((errors) => {
                        message.error(errors.response.data, 1.5);
                      })
                      .finally(() => {
                        setLoadingSubmit(false);
                      });
                  },
                  onCancel() {},
                });
            }}
          >
            Update
          </Button>,
        ]}
      >
        <div className="my-6">
          <div className="container">
            <div>
              <p className="text-lg">
                Cảm ơn bạn đã tham gia ứng tuyển cho vị trí Tài xế của
                SecureRideHome.
                <br />
                <span className="font-semibold">
                  SAU KHI HOÀN TẤT FORM NÀY, BẠN CÓ THỂ ĐẾN THAM GIA PHỎNG VẤN
                  TRỰC TIẾP TẠI VĂN PHÒNG ĐỘI XE TỪ THỨ 2 ĐẾN THỨ 7
                </span>
                <br />
                <span className="font-semibold">
                  - Thời gian phỏng vấn: Sáng từ 08h30-11h00, chiều từ 13h30-
                  16h30
                </span>
                <br />
                <span className="font-semibold">
                  - Vui lòng mang theo CCCD và Bằng lái xe bản gốc, mặc áo ngắn
                  tay có cổ, đi giày và mang theo bút viết khi tham gia phỏng
                  vấn
                </span>
                <br />
                Hẹn gặp lại bạn tại buổi phỏng vấn.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-base">
            <span className="text-red-700 ">*</span> Những ô bắt buộc
          </p>
          <div className="form grid grid-cols-2 gap-6 mt-6"></div>
        </div>

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

export default ModalRecruitmentForm;
