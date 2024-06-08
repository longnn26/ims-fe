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
import { Form } from "antd";
import { emailRegex, idCardRegex, phoneNumberRegex } from "@utils/constants";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { disableFutureDates, disablePastDates } from "@utils/helpers";

interface SecondStageProps {
  formIdentityCardRef: any;
  formIdentityCard: FormInstance;
  formAccount: FormInstance;
  data?: any;
}

const SecondStageCreate: React.FC<SecondStageProps> = (props) => {
  const { formIdentityCardRef, formIdentityCard, formAccount, data } = props;
  const [maxLength, setMaxLength] = useState(10);

  const handleChangePhoneNumber = (e) => {
    const value = e.target.value;
    if (value.startsWith("84")) {
      setMaxLength(11);
    } else if (value.startsWith("0")) {
      setMaxLength(10);
    }
  };

  // xử lý ảnh
  const handleBeforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Bạn chỉ có thể tải lên tệp hình ảnh!");
    }
    return isImage || Upload.LIST_IGNORE;
  };

  const normFile = (e: any) => {
    console.log("Upload event:", e);
    return e && e.fileList;
  };

  return (
    <div className="stage-container flex flex-col justify-center items-center">
      <Form
        ref={formIdentityCardRef}
        form={formIdentityCard}
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 16 }}
        style={{ width: "100%" }}
        layout="vertical"
      >
        <div className="grid grid-cols-2 ">
          {/* CCCD */}
          <Form.Item
            name="identityCardNumber"
            label="Số CCCD"
            initialValue={data?.identityCardNumber}
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

          {/* Họ và tên */}
          <Form.Item
            name="fullName"
            label="Họ và tên"
            initialValue={formAccount.getFieldValue("fullName")}
            rules={[
              { required: true, message: "Vui lòng nhập họ và tên" },
              { type: "string" },
            ]}
            style={{ marginLeft: "12px", marginRight: "12px" }}
          >
            <Input
              placeholder="Vui lòng nhập họ và tên"
              className="h-9"
              disabled
            />
          </Form.Item>

          {/* Quốc tịch */}
          <Form.Item
            name="nationality"
            label="Quốc tịch"
            rules={[
              { required: true, message: "Vui lòng nhập quốc tịch" },
              { type: "string" },
            ]}
            style={{ marginLeft: "12px", marginRight: "12px" }}
          >
            <Input placeholder="Vui lòng nhập quốc tịch" className="h-9" />
          </Form.Item>

          {/* Quê quán */}
          <Form.Item
            name="placeOrigin"
            label="Quê quán"
            rules={[
              { required: true, message: "Vui lòng nhập quê quán" },
              { type: "string" },
            ]}
            style={{ marginLeft: "12px", marginRight: "12px" }}
          >
            <Input placeholder="Vui lòng nhập quê quán" className="h-9" />
          </Form.Item>

          {/* Nơi thường trú */}
          <Form.Item
            name="placeResidence"
            label="Nơi thường trú"
            initialValue={data?.address}
            rules={[
              { required: true, message: "Vui lòng nhập nơi thường trú" },
              { type: "string" },
            ]}
            style={{ marginLeft: "12px", marginRight: "12px" }}
          >
            <Input placeholder="Vui lòng nhập nơi thường trú" className="h-9" />
          </Form.Item>

          {/* Đặc điểm nhận dạng */}
          <Form.Item
            name="personalIdentification"
            label="Đặc điểm nhận dạng"
            rules={[
              { required: true, message: "Vui lòng nhập đặc điểm nhận dạng" },
              { type: "string" },
            ]}
            style={{ marginLeft: "12px", marginRight: "12px" }}
          >
            <Input
              placeholder="Vui lòng nhập đặc điểm nhận dạng"
              className="h-9"
            />
          </Form.Item>

          {/* ngày sinh */}
          <Form.Item
            label="Ngày sinh"
            name="dob"
            initialValue={formAccount.getFieldValue("dob")}
            rules={[
              {
                required: true,
                message: "Vui lòng chọn ngày sinh",
              },
            ]}
            style={{ marginLeft: "12px", marginRight: "12px" }}
          >
            <DatePicker
              className="h-9"
              style={{ width: "100%" }}
              placeholder="Chọn ngày"
              disabledDate={disableFutureDates}
              disabled
            />
          </Form.Item>

          {/* ngày hết hạn */}
          <Form.Item
            label="Ngày hết hạn"
            name="expiredDate"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn ngày hết hạn",
              },
            ]}
            style={{ marginLeft: "12px", marginRight: "12px" }}
          >
            <DatePicker
              className="h-9"
              style={{ width: "100%" }}
              placeholder="Chọn ngày"
              disabledDate={disablePastDates}
            />
          </Form.Item>

          {/* ảnh mặt trước */}
          <Form.Item
            name="imageFront"
            label="Ảnh mặt trước"
            valuePropName="file"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: "Vui lòng chọn ảnh mặt trước" }]}
            style={{ marginLeft: "12px", marginRight: "12px" }}
          >
            <Upload
              name="imageFront"
              listType="picture"
              beforeUpload={handleBeforeUpload}
              maxCount={1}
              defaultFileList={
                formIdentityCard.getFieldValue("imageFront") ?? []
              }
            >
              <Button icon={<UploadOutlined />}>Bấm vào để tải lên</Button>
            </Upload>
          </Form.Item>

          {/* ảnh mặt sau */}
          <Form.Item
            name="imageBehind"
            label="Ảnh mặt sau"
            valuePropName="file"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: "Vui lòng chọn ảnh mặt sau" }]}
            style={{ marginLeft: "12px", marginRight: "12px" }}
          >
            <Upload
              name="imageBehind"
              listType="picture"
              beforeUpload={handleBeforeUpload}
              maxCount={1}
              defaultFileList={formIdentityCard.getFieldValue("imageBehind")}
            >
              <Button icon={<UploadOutlined />}>Bấm vào để tải lên</Button>
            </Upload>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default SecondStageCreate;
