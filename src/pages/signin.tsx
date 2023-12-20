/* eslint-disable @next/next/no-img-element */
"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { Form, Input, Space, message, Button } from "antd";
import { useEffect, useState } from "react";

interface Props { }

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

  const isValidEmail = (username) => {
    const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    return emailRegex.test(username);
  }

  const onFinish = async (values) => {
    let res;

    const isCustomer = isValidEmail(values.username)

    if (isCustomer) {
      // For customer login
      res = await signIn("cus_credentials", {
        redirect: false,
        email: values.username,
        password: values.password,
      });
    } else {
      // For staff login
      res = await signIn("credentials", {
        redirect: false,
        username: values.username,
        password: values.password,
      });
    }
    if (res.error) {
      return message.error("Wrong login account information!");
    } else {
      message.success("Login successfully!");
      return router.push("/");
    }
  };

  return (
    <>
      <main className="p-4 md:p-10 mx-auto max-w-7xl">
        <div>
          <img
            className="absolute left-0 top-[24rem] h-auto w-full"
            src="/images/background.png"
            alt=""
          />
        </div>
        <div className="m-auto max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-2xl relative">
          <div className="flex justify-center">
            <img
              src="/images/logo.jpeg"
              className="h-20 mr-3"
              alt="Logo"
            />
          </div>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              name="username"
              label="Username or Email"
              rules={[{ required: true }, { type: "string" }]}
            >
              <Input placeholder="username" className="h-9" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true }, { type: "string", min: 6, max: 32 }]}
            >
              <Input placeholder="password" type="password" className="h-9" />
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
