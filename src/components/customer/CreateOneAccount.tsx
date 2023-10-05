"use client";

import React from "react";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
} from "antd";
import { Typography } from "antd";

const { Title, Text } = Typography;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const CreateOneAccount: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
  };

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      style={{ maxWidth: 600 }}
      scrollToFirstError
    >
      <Title type="danger" style={{ textAlign: "center" }} level={3}>
        Thêm Một Tài Khoản Mới
      </Title>
      <div style={{ textAlign: "center", paddingBottom: "15px" }}>
        <Text type="warning" strong>
          Những trường có dấu * là những trường bắt buộc
        </Text>
      </div>

      <Form.Item
        name="name"
        label="Tên công ty"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập Tên công ty!",
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="representative"
        label="Người đại diện"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập Người đại diện!",
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="tax"
        label="Mã số thuế"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập Mã số thuế!",
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="address"
        label="Địa chỉ"
        rules={[
          {
            message: "Vui lòng nhập địa chỉ!",
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="email"
        label="E-mail"
        rules={[
          {
            type: "email",
            message: "The input is not valid E-mail!",
          },
          {
            required: true,
            message: "Vui lòng nhập Email!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Số điện thoại"
        rules={[
          {
            type: "number",
            message: "Vui lòng nhập chữ số từ 1 - 9",
          },
          {
            required: true,
            message: "Vui lòng nhập Số điện thoại!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      {/* <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          Tạo Tài Khoản
        </Button>
      </Form.Item> */}
    </Form>
  );
};

export default CreateOneAccount;
