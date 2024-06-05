import {
  DatePicker,
  FormInstance,
  Input,
  Select,
  Upload,
  Button,
  message,
} from "antd";
import React, { useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { Form } from "antd";
import { emailRegex, idCardRegex, phoneNumberRegex } from "@utils/constants";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { disableFutureDates } from "@utils/helpers";

interface FirstStageProps {
  formAccountRef: any;
  formAccount: FormInstance;
  data?: any;
}

const FirstStageCreate: React.FC<FirstStageProps> = (props) => {
  const { formAccountRef, formAccount, data } = props;
  const [maxLength, setMaxLength] = useState(10);
  const [fileList, setFileList] = useState<any[]>([]);

  const handleChangePhoneNumber = (e) => {
    const value = e.target.value;
    if (value.startsWith("84")) {
      setMaxLength(11);
    } else if (value.startsWith("0")) {
      setMaxLength(10);
    }
  };

  const normFile = (e: any) => {
    console.log("Upload event:", e);

    return e && e.fileList;
  };

  const handleBeforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Bạn chỉ có thể tải lên tệp hình ảnh!");
    }
    return isImage || Upload.LIST_IGNORE;
  };

  const customUploadRequest = ({ file, onSuccess, onError }: any) => {
    console.log("Custom upload request: ", file);
  };

  return (
    <div className="stage-container flex flex-col justify-center items-center">
      <Form
        ref={formAccountRef}
        form={formAccount}
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
            initialValue={data?.fullName}
            rules={[
              { required: true, message: "Vui lòng nhập họ và tên" },
              { type: "string" },
            ]}
            style={{ marginLeft: "12px", marginRight: "12px" }}
          >
            <Input placeholder="Vui lòng nhập họ và tên" className="h-9" />
          </Form.Item>

          {/* Email */}
          <Form.Item
            name="email"
            label="Email"
            initialValue={data?.email}
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
            initialValue={data?.phoneNumber}
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

          {/* giới tính */}
          <Form.Item
            label="Giới tính"
            name="gender"
            rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
            style={{ marginLeft: "12px", marginRight: "12px" }}
          >
            <Select className="h-9" placeholder="Chọn giới tính" allowClear>
              <Select.Option value="Male">Nam</Select.Option>
              <Select.Option value="Female">Nữ</Select.Option>
              <Select.Option value="Other">Khác</Select.Option>
            </Select>
          </Form.Item>

          {/* ngày sinh */}
          <Form.Item
            label="Ngày sinh"
            name="dob"
            rules={[{ required: true, message: "Vui lòng nhập ngày sinh!" }]}
            style={{ marginLeft: "12px", marginRight: "12px" }}
          >
            <DatePicker
              className="h-9"
              style={{ width: "100%" }}
              placeholder="Chọn ngày"
              disabledDate={disableFutureDates}
            />
          </Form.Item>

          {/* {address} */}
          <Form.Item
            name="address"
            label="Địa chỉ:"
            initialValue={data?.address}
            rules={[
              { required: true, message: "Vui lòng nhập địa chỉ" },
              { type: "string" },
            ]}
            style={{ marginLeft: "12px", marginRight: "12px" }}
          >
            <Input placeholder="Vui lòng nhập địa chỉ" className="h-9" />
          </Form.Item>
        </div>

        {/* avatar */}
        <div style={{ width: "50%" }}>
          <Form.Item
            name="avatar"
            label="Ảnh đại diện"
            valuePropName="file"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: "Vui lòng chọn ảnh đại diện" }]}
            style={{ marginLeft: "12px", marginRight: "12px" }}
          >
            <Upload
              action={""}
              name="avatar"
              listType="picture"
              maxCount={1}
              beforeUpload={handleBeforeUpload}
              defaultFileList={formAccount.getFieldValue("avatar")}
            >
              <Button icon={<UploadOutlined />}>Bấm vào để tải lên</Button>
            </Upload>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default FirstStageCreate;
