/* eslint-disable @next/next/no-img-element */
"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { Form, Input, Space, message, Button } from "antd";
import { useEffect, useState } from "react";
import DotBackGround from "@components/login/DotBackGround";

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

  const isValidEmail = (email) => {
    const emailRegex =
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    return emailRegex.test(email);
  };

  const onFinish = async (values) => {
    let res;

    const isAdmin = isValidEmail(values.email);

    if (isAdmin) {
      // For admin login
      res = await signIn("cus_credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });
      console.log("res login", res);
    } else {
      // For staff login
      res = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });
    }
    if (res.error) {
      return message.error("Wrong login account information!", 1.5);
    } else {
      message.success("Login successfully", 1.5);
      return router.push("/dashboard");
    }
  };

  const handleNavigateToHomePage = () => {
    router.push("/");
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white relative">
          <div
            className="flex flex-col items-center justify-between pt-0 pr-10 pb-0 pl-10 mt-0 mr-auto mb-0 ml-auto max-w-7xl
        xl:px-5 lg:flex-row"
          >
            <div className="flex flex-col items-center w-full pt-5 pr-10 pb-20 pl-10 lg:pt-20 lg:flex-row">
              <div className="w-full bg-cover relative max-w-md lg:max-w-2xl lg:w-7/12">
                <div className="flex flex-col items-center justify-center w-full h-full relative lg:pr-10">
                  <img
                    src="https://live.staticflickr.com/65535/53649951709_cb697af95f_z.jpg"
                    className="btn-"
                  />
                </div>
              </div>
              <div className="w-full mt-20 mr-0 mb-0 ml-0 relative z-10 max-w-2xl lg:mt-0 lg:w-5/12">
                <div
                  className="flex flex-col justify-center items-center pt-10 pr-10 pb-10 pl-10 bg-white shadow-2xl rounded-xl
              relative z-10"
                >
                  <div
                    className="flex justify-center mb-4 cursor-pointer"
                    onClick={handleNavigateToHomePage}
                  >
                    <img
                      src="/images/logo_with_line_text.png"
                      className="h-14"
                      alt="Logo"
                    />
                  </div>

                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                    className="w-80"
                  >
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[{ required: true }, { type: "string" }]}
                    >
                      <Input placeholder="email" className="h-9" />
                    </Form.Item>
                    <Form.Item
                      name="password"
                      label="Password"
                      rules={[
                        { required: true },
                        { type: "string", min: 6, max: 32 },
                      ]}
                    >
                      <Input.Password
                        placeholder="password"
                        type="password"
                        className="h-9"
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        disabled={!submittable}
                        className="w-full h-9 mt-3"
                      >
                        Login
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
                <DotBackGround />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signin;
