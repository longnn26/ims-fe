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

interface ThirdStageProps {
  formDrivingLicenseRef: any;
  formDrivingLicense: FormInstance;
  data?: any;
}

const ThirdStageCreate: React.FC<ThirdStageProps> = (props) => {
  const { formDrivingLicenseRef, formDrivingLicense, data } = props;
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
        ref={formDrivingLicenseRef}
        form={formDrivingLicense}
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 16 }}
        style={{ width: "100%" }}
        layout="vertical"
      >
        <div className="grid grid-cols-2 ">
          {/* Số GPLX */}
          <Form.Item
            name="drivingLicenseNumber"
            label="Số GPLX"
            initialValue={data?.drivingLicenseNumber}
            rules={[
              { required: true, message: "Vui lòng nhập số GPLX" },
              { type: "string" },
              {
                pattern: idCardRegex,
                message: "GPLX không bao gồm kí tự chữ!",
              },
              {
                min: 12,
                message: "Vui lòng nhập GPLX hợp lệ!",
              },
            ]}
            className="mx-3"
          >
            <Input
              placeholder="Vui lòng nhập số GPLX"
              className="h-9"
              maxLength={12}
            />
          </Form.Item>

          {/* Hạng bằng lái xe */}
          <Form.Item
            label="Hạng bằng lái xe"
            initialValue={data?.drivingLicenseType}
            name="type"
            rules={[{ required: true, message: "Vui lòng chọn loại bằng" }]}
            className="mx-3"
          >
            <Select
              className="h-9"
              placeholder="Chọn hạng bằng lái xe"
              allowClear
            >
              <Select.Option value="Hạng B2">Hạng B2</Select.Option>
              <Select.Option value="Hạng C">Hạng C</Select.Option>
              <Select.Option value=">Hạng D">Hạng D</Select.Option>
              <Select.Option value="Hạng E">Hạng E</Select.Option>
            </Select>
          </Form.Item>

          {/* issueDate */}
          <Form.Item
            label="Ngày cấp"
            name="issueDate"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn ngày sinh",
              },
            ]}
            className="mx-3"
          >
            <DatePicker
              className="h-9"
              style={{ width: "100%" }}
              placeholder="Chọn ngày"
              disabledDate={disableFutureDates}
            />
          </Form.Item>

          {/* expiredDate */}
          <Form.Item
            label="Ngày hết hạn"
            name="expiredDate"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn ngày hết hạn",
              },
            ]}
            className="mx-3"
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
            className="mx-3"
          >
            <Upload
              name="imageFront"
              listType="picture"
              beforeUpload={handleBeforeUpload}
              maxCount={1}
              defaultFileList={
                formDrivingLicense.getFieldValue("imageFront") ?? []
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
            className="mx-3"
          >
            <Upload
              name="imageBehind"
              listType="picture"
              beforeUpload={handleBeforeUpload}
              maxCount={1}
              defaultFileList={formDrivingLicense.getFieldValue("imageBehind")}
            >
              <Button icon={<UploadOutlined />}>Bấm vào để tải lên</Button>
            </Upload>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default ThirdStageCreate;
