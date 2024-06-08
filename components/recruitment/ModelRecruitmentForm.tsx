import React, { useRef, useState, useEffect } from "react";
import { Button, Input, Modal, Select, Space, Card, message } from "antd";
import { Form, DatePicker } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { UserUpdateModel, User } from "@models/user";
import useSelector from "@hooks/use-selector";
import { ChangePassword, Customer } from "@models/customer";
import customerService from "@services/customer";
import supportService from "@services/support";
import { useSession } from "next-auth/react";
import { emailRegex, idCardRegex, phoneNumberRegex } from "@utils/constants";
import { SupportType } from "@models/support";
import { SupportTypeModelEnum } from "@utils/enum";
const { Option } = Select;
const { confirm } = Modal;
const { RangePicker } = DatePicker;

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

  const [maxLength, setMaxLength] = useState(10);

  const handleChangePhoneNumber = (e) => {
    const value = e.target.value;
    if (value.startsWith("84")) {
      setMaxLength(11);
    } else if (value.startsWith("0")) {
      setMaxLength(10);
    }
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

  return (
    <>
      <Modal
        title={
          <p className="inline-block m-auto text-2xl">
            Thông tin ứng viên Tài xế tại SecureRideHome
          </p>
        }
        centered
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
                  cancelText: "Hủy",
                  okText: "Xác nhận",
                  title: "Bạn có chắc muốn nộp đơn ứng tuyển?",
                  async onOk() {
                    setLoadingSubmit(true);

                    await supportService
                      .createSupport({
                        fullName: form.getFieldValue("fullName"),
                        email: form.getFieldValue("email"),
                        phoneNumber: form.getFieldValue("phoneNumber"),
                        identityCardNumber:
                          form.getFieldValue("identityCardNumber"),
                        birthPlace: form.getFieldValue("birthPlace"),
                        address: form.getFieldValue("address"),
                        drivingLicenseNumber: form.getFieldValue(
                          "drivingLicenseNumber"
                        ),
                        drivingLicenseType:
                          form.getFieldValue("drivingLicenseType"),
                        msgContent: form.getFieldValue("msgContent"),
                        supportType: SupportTypeModelEnum.RECRUITMENT,
                      } as SupportType)
                      .then((res) => {
                        message.success("Nộp đơn ứng tuyển thành công!", 1.5);
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
            Đăng kí
          </Button>,
        ]}
      >
        <div className="mx-6">
          <div className="my-6">
            <div className="container">
              <div>
                <p className="text-lg">
                  Cảm ơn bạn đã tham gia ứng tuyển cho vị trí Tài xế của
                  SecureRideHome.
                  <br />
                  <span className="font-semibold">
                    SAU KHI HOÀN TẤT FORM NÀY, BẠN CÓ THỂ ĐẾN PHỎNG VẤN TRỰC
                    TIẾP TẠI VĂN PHÒNG ĐỘI XE TỪ THỨ 2 ĐẾN THỨ 7
                  </span>
                  <br />
                  <span className="font-semibold">
                    - Thời gian phỏng vấn: Sáng từ 08h30-11h00, chiều từ 13h30-
                    16h30
                  </span>
                  <br />
                  <span className="font-semibold">
                    - Vui lòng mang theo CCCD và Bằng lái xe bản gốc, mặc áo
                    ngắn tay có cổ, đi giày và mang theo bút viết khi tham gia
                    phỏng vấn
                  </span>
                  <br />
                  Hẹn gặp lại bạn tại buổi phỏng vấn.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <p className="text-lg">
              <span className="text-red-600">*</span> Những ô bắt buộc
            </p>

            <Form
              ref={formRef}
              form={form}
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 16 }}
              style={{ width: "100%" }}
              layout="vertical"
            >
              <div className="grid grid-cols-2 ">
                {/* Họ và tên */}

                <Form.Item
                  name="fullName"
                  label="Họ và tên"
                  rules={[
                    { required: true, message: "Vui lòng nhập họ và tên" },
                    { type: "string" },
                  ]}
                  style={{ marginLeft: "12px", marginRight: "12px" }}
                >
                  <Input
                    placeholder="Vui lòng nhập họ và tên"
                    className="h-9"
                  />
                </Form.Item>

                {/* Email */}
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: "Vui lòng nhập email!" },
                    { type: "string" },
                    {
                      pattern: emailRegex,
                      message: "Vui lòng nhập email hợp lệ!",
                    },
                  ]}
                  style={{ marginLeft: "12px", marginRight: "12px" }}
                >
                  <Input placeholder="Vui lòng nhập email!" className="h-9" />
                </Form.Item>
                {/* Số điện thoại */}
                <Form.Item
                  name="phoneNumber"
                  label="Số điện thoại"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại" },
                    { type: "string" },
                    {
                      pattern: idCardRegex,
                      message: "Số điện thoại không bao gồm kí tự chữ!",
                    },
                    {
                      pattern: phoneNumberRegex,
                      message: "Vui lòng nhập số điện thoại hợp lệ!",
                    },
                  ]}
                  style={{ marginLeft: "12px", marginRight: "12px" }}
                >
                  <Input
                    placeholder="Vui lòng nhập số điện thoại"
                    className="h-9"
                    maxLength={maxLength}
                    onChange={handleChangePhoneNumber}
                  />
                </Form.Item>
                {/* CCCD */}
                <Form.Item
                  name="identityCardNumber"
                  label="Số CCCD"
                  rules={[
                    { required: true, message: "Vui lòng nhập số CCCD" },
                    { type: "string" },
                    {
                      pattern: idCardRegex,
                      message: "CCCD không bao gồm kí tự chữ!",
                    },
                    {
                      min: 12,
                      message: "Vui lòng nhập CCCD hợp lệ!",
                    },
                  ]}
                  style={{ marginLeft: "12px", marginRight: "12px" }}
                >
                  <Input
                    placeholder="Vui lòng nhập số CCCD"
                    className="h-9"
                    maxLength={12}
                  />
                </Form.Item>
                {/* ngày sinh */}
                {/* <Form.Item
                label="DatePicker"
                name="DatePicker"
                rules={[{ required: true, message: "Please input!" }]}
              >
                <DatePicker />
              </Form.Item> */}

                {/* Nơi sinh */}
                <Form.Item
                  name="birthPlace"
                  label="Nơi sinh"
                  rules={[
                    { required: true, message: "Vui lòng nhập nơi sinh" },
                    { type: "string" },
                  ]}
                  style={{ marginLeft: "12px", marginRight: "12px" }}
                >
                  <Input placeholder="Vui lòng nhập nơi sinh" className="h-9" />
                </Form.Item>

                {/* Nơi sinh */}
                <Form.Item
                  name="address"
                  label="Địa chỉ thường trú"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập địa chỉ thường trú",
                    },
                    { type: "string" },
                  ]}
                  style={{ marginLeft: "12px", marginRight: "12px" }}
                >
                  <Input
                    placeholder="Vui lòng nhập địa chỉ thường trú"
                    className="h-9"
                  />
                </Form.Item>

                {/* số bằng lái xe */}
                <Form.Item
                  name="drivingLicenseNumber"
                  label="Số bằng lái xe"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập số bằng lái xe",
                    },
                    { type: "string" },
                    {
                      pattern: idCardRegex,
                      message: "Số bằng lái xe không bao gồm kí tự chữ!",
                    },
                    {
                      min: 12,
                      message: "Vui lòng nhập số bằng lái xe hợp lệ!",
                    },
                  ]}
                  style={{ marginLeft: "12px", marginRight: "12px" }}
                >
                  <Input
                    placeholder="Vui lòng nhập số bằng lái xe"
                    className="h-9"
                    maxLength={12}
                  />
                </Form.Item>

                {/* loại bằng lái xe */}
                <Form.Item
                  name="drivingLicenseType"
                  label="Loại chứng chỉ lái xe của bạn"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn loại bằng",
                    },
                  ]}
                  style={{ marginLeft: "12px", marginRight: "12px" }}
                >
                  <Select className="h-9">
                    <Select.Option value="Hạng B2">Hạng B2</Select.Option>
                  </Select>
                </Form.Item>
              </div>

              <Form.Item
                name="msgContent"
                label="Nội dung nhắn khác"
                rules={[
                  {
                    required: false,
                  },
                  { type: "string" },
                ]}
                style={{ marginLeft: "12px", marginRight: "12px" }}
              >
                <Input.TextArea placeholder="" className="h-9" />
              </Form.Item>
            </Form>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalRecruitmentForm;
