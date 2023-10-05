"use client";
import React, { useState } from "react";
import { Form, Input, Modal } from "antd";
import { Typography } from "antd";

const { Title } = Typography;
const { TextArea } = Input;

interface Values {
  title: string;
  description: string;
  modifier: string;
}

interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
}

const EditTicketModal: React.FC<CollectionCreateFormProps> = ({
  open,
  onCreate,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [componentDisabled] = useState<boolean>(true);

  return (
    <Modal
      style={{ width: 1000 }}
      open={open}
      title={
        <Title type="danger" style={{ textAlign: "center" }} level={3}>
          CHI TIẾT YÊU CẦU
        </Title>
      }
      okText="Lưu Thông Tin"
      cancelText="Cancel"
      onCancel={onCancel}
      width={"1000px"}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <div style={{ display: "flex", paddingTop: "20px" }}>
        <Form
          labelCol={{ span: 9 }}
          wrapperCol={{ span: 12 }}
          layout="horizontal"
          disabled={componentDisabled}
          style={{ width: 500 }}
        >
          <Form.Item label="Tên công ty">
            <Input />
          </Form.Item>
          <Form.Item label="Người đại diện">
            <Input />
          </Form.Item>
          <Form.Item label="Mã số thuê">
            <Input />
          </Form.Item>
          <Form.Item label="Số điện thoại">
            <Input />
          </Form.Item>
          <Form.Item label="E-mail">
            <Input />
          </Form.Item>
          <Form.Item label="Địa chỉ">
            <Input />
          </Form.Item>
          <Form.Item label="Ngày tạo yêu cầu">
            <Input />
          </Form.Item>
          <Form.Item label="Ghi chú">
            <TextArea rows={4} />
          </Form.Item>
        </Form>
        <Form
          labelCol={{ span: 9 }}
          wrapperCol={{ span: 12 }}
          layout="horizontal"
          // disabled={componentDisabled}
          style={{ width: 500 }}
        >
          <Form.Item label="Username">
            <Input />
          </Form.Item>
          <Form.Item label="Password">
            <Input />
          </Form.Item>
          <Form.Item label="Model">
            <Input />
          </Form.Item>
          <Form.Item label="Serial number">
            <Input />
          </Form.Item>
          <Form.Item label="Công suất">
            <Input />
          </Form.Item>
          <Form.Item label="Vị trí đặt server">
            <Input />
          </Form.Item>
          <Form.Item label="IP">
            <Input />
          </Form.Item>
          <Form.Item label="Subnet mask">
            <Input />
          </Form.Item>
          <Form.Item label="Gateway">
            <Input />
          </Form.Item>
          <Form.Item label="DNS">
            <Input />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default EditTicketModal;
