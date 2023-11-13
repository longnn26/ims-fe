"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { Form, Input, Space, message, Button } from "antd";
import { useEffect, useState } from "react";

interface Props {}

const Signin: React.FC<Props> = (props) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [submittable, setSubmittable] = useState(false);
  const values = Form.useWatch([], form);

  useEffect(() => {
    form.validateFields({ validateOnly: true }).then(
      () => {
        setSubmittable(true);
      },
      () => {
        setSubmittable(false);
      }
    );
  }, [form, values]);

  const onFinish = async (values) => {
    const res: any = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });
    if (res.error) {
      return message.error(res.error);
    } else {
      message.success("Login success!");
      return router.push("/");
    }
  };

  return (
    <>
      <main className="p-4 md:p-10 mx-auto max-w-7xl">
        <div className="m-auto max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow">
          <div className="flex justify-center">
            <img
              src="https://telecom.qtsc.com.vn/Common/img/QTSClogo.png"
              className="h-12 mr-3"
              alt="FlowBite Logo"
            />
          </div>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true }, { type: "email" }]}
            >
              <Input placeholder="quangtrung@gmail.com" className="h-9" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true }, { type: "string", min: 6, max: 32 }]}
            >
              <Input placeholder="password" className="h-9" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={!submittable}
                className="w-full h-9"
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </main>
    </>
  );
};

export default Signin;
