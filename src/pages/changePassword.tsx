/* eslint-disable @next/next/no-img-element */
"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
  Form,
  Input,
  Space,
  message,
  Button,
  Layout,
  Spin,
  Alert,
  Modal,
} from "antd";
import { useEffect, useState } from "react";
import customerService from "@services/customer";
import Head from "next/head";

const { Content, Footer, Header } = Layout;

interface Props {}

const PasswordChange: React.FC<Props> = (props) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const { data: session } = useSession();
  const [submittable, setSubmittable] = useState(false);
  const values = Form.useWatch([], form);
  const [loading, setLoading] = useState<boolean>(false);

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
    setLoading(true);
    await customerService
      .changePassword(
        session?.user.access_token!,
        values.currentPass,
        values.password
      )
      .then((res) => {
        message.success("Password change successfully!", 1.5);
        return router.push("/");
      })
      .catch((errors) => {
        message.error(errors.response.data, 1.5);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <>
      <Layout className="h-screen">
        <Header
          className="h-auto flex justify-center"
          style={{ background: "white", alignItems: "center" }}
        >
          <h1>Change your password after first login</h1>
        </Header>
        <Content style={{ background: "white" }}>
          <main className="flex items-center justify-center p-4 md:p-10 mx-auto max-w-7xl">
            <div className="flex justify-center items-center">
              <img className="w-1/2" src="/images/reset-password.png" alt="" />
            </div>
            <div className="m-auto w-1/2 max-w-sm p-6 bg-white relative">
              <div className="flex">
                <h3 style={{ fontFamily: "sans-serif" }}>Change Password</h3>
              </div>
              {loading === false && (
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  autoComplete="off"
                >
                  <Form.Item
                    name="currentPass"
                    label="Current Password"
                    rules={[
                      { required: true, type: "string", min: 8, max: 25 },
                    ]}
                  >
                    <Input.Password
                      type="password"
                      placeholder="Your Password"
                      className="h-9"
                    />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                      { required: true, min: 8, max: 25 },
                      {
                        pattern: /^(?=.*[A-Z])/gm,
                        message:
                          "Password must have at least 1 uppercase letter",
                      },
                      {
                        pattern: /^(?=.*[a-z])/gm,
                        message:
                          "Password must have at least 1 lowercase letter",
                      },
                      {
                        pattern: /^(?=.*\d)/gm,
                        message: "Password must have at least 1 number",
                      },
                      {
                        pattern: /^(?=.*[@$!%*?&#^\/])/gm,
                        message:
                          "Password must have at least 1 special character",
                      },
                      {
                        validator: async (_, value) => {
                          if (value) {
                            if (value === form.getFieldValue("currentPass")) {
                              return Promise.reject(
                                new Error(
                                  "The password must be different to the current password!"
                                )
                              );
                            } else if (value === "Password@123")
                              return Promise.reject(
                                new Error(
                                  "The password must be different to the default password!"
                                )
                              );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input.Password
                      placeholder="Password"
                      type="password"
                      className="h-9"
                    />
                  </Form.Item>
                  <Form.Item
                    name="confirmPassword"
                    label="Confirm new password"
                    rules={[
                      { required: true, type: "string", min: 8, max: 25 },
                      {
                        validator: async (_, value) => {
                          if (
                            value &&
                            value !== form.getFieldValue("password")
                          ) {
                            return Promise.reject(
                              new Error("The confirm password is not match!")
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input
                      placeholder="Confirm password"
                      type="password"
                      className="h-9"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      disabled={!submittable}
                      className="w-full h-12"
                    >
                      Change Password
                    </Button>
                  </Form.Item>
                </Form>
              )}
              {loading === true && (
                <Spin size="large" tip="Updating your password">
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                  >
                    <Form.Item label="Current Password">
                      <Input placeholder="Your Password" className="h-9" />
                    </Form.Item>
                    <Form.Item label="Password">
                      <Input.Password
                        placeholder="Password"
                        type="password"
                        className="h-9"
                      />
                    </Form.Item>
                    <Form.Item label="Confirm new password">
                      <Input.Password
                        placeholder="Confirm password"
                        type="password"
                        className="h-9"
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        disabled={true}
                        className="w-full h-12"
                      >
                        Change Password
                      </Button>
                    </Form.Item>
                  </Form>
                </Spin>
              )}
            </div>
          </main>
        </Content>
        <Footer style={{ textAlign: "center" }}>Copyright © 2023 QTSC</Footer>
      </Layout>
    </>
  );
};

export default PasswordChange;
