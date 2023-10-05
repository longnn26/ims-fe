"use client";
import React from "react";
import { Form, Input, Modal } from "antd";
import { Typography } from "antd";

const { Title } = Typography;

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

const EditCustomerModal: React.FC<CollectionCreateFormProps> = ({
  open,
  onCreate,
  onCancel,
}) => {
  const [form] = Form.useForm();

  return (
    <Modal
      style={{ width: 1000 }}
      open={open}
      title={
        <Title type="danger" style={{ textAlign: "center" }} level={3}>
          CHỈNH SỬA THÔNG TIN KHÁCH HÀNG
        </Title>
      }
      okText="Lưu Thông Tin"
      cancelText="Cancel"
      onCancel={onCancel}
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
      <div style={{ paddingTop: "20px", paddingBottom: "10px" }}>
        <Form
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 12 }}
          layout="horizontal"
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
          <Form.Item label="Địa chỉ">
            <Input />
          </Form.Item>
          <Form.Item label="E-mail">
            <Input />
          </Form.Item>
          <Form.Item label="Số điện thoại">
            <Input />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default EditCustomerModal;
