"use client";

import { Form, Input, Button } from "antd";
import dynamic from "next/dynamic";
import React, { useRef } from "react";
import supportService from "@services/support";
import { SupportType } from "@models/support";
import { SupportTypeModelEnum } from "@utils/enum";
import { TypeOptions, toast } from "react-toastify";

const HomeLayoutNoSSR = dynamic(() => import("@layout/HomeLayout"), {
  ssr: false,
});

const formContainerStyle = {
  flex: 1,
  padding: "0px 50px 50px 50px",
};

const backgroundImageStyle = {
  flex: 1,
  backgroundImage:
    'url("https://techvccloud.mediacdn.vn/2021/1/6/contact-center-la-gi-3-16099099639661159534106.png")',
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "left top",
  height: "100vh",
};

const Contact = () => {
  const formRef = useRef(null);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const response = await supportService.createSupport({
        fullName: values.fullname,
        email: values.email,
        phoneNumber: values.phoneNumber,
        msgContent: values.msgContent,
        supportType: SupportTypeModelEnum.SUPPORT_ISSUE,
      } as SupportType);
      console.log("Success:", response);
      toast(`Chuyển trạng thái thành công!`, {
        type: "success" as TypeOptions,
        position: "top-right",
      });
      form.resetFields();
    } catch (error) {
      console.error("Failed:", error);
      toast("Có lỗi xảy ra vui lòng thử lại sau!", {
        type: "error" as TypeOptions,
        position: "top-right",
      });
    }
  };

  return (
    <HomeLayoutNoSSR
      content={
        <div
          className="container"
          style={{
            display: "flex",
            marginRight: "auto",
            marginLeft: "auto",
            position: "relative",
            alignItems: "center",
          }}
        >
          <div style={formContainerStyle}>
            <div>
              <p className="uppercase text-gray-400">Liên hệ</p>
              <h1 className="uppercase text-3xl my-4">Gửi tin nhắn</h1>
            </div>
            <Form
              ref={formRef}
              form={form}
              initialValues={{ remember: true }}
              layout="vertical"
              onFinish={onFinish}
            >
              <div className="grid grid-cols-2 gap-3">
                <Form.Item
                  label="Họ và tên"
                  name="fullname"
                  rules={[
                    { required: true, message: "Vui lòng điền tên của bạn!" },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true, message: "Vui lòng nhập email!" }]}
                >
                  <Input />
                </Form.Item>
              </div>

              <Form.Item
                label="Số điện thoại"
                name="phoneNumber"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền số điện thoại!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Lời nhắn"
                name="msgContent"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng để lại lời nhắn!",
                  },
                ]}
              >
                <Input.TextArea />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Gửi tin nhắn
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div style={backgroundImageStyle}></div>
        </div>
      }
    />
  );
};

export default Contact;
