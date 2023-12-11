"use client";
import React, { ReactNode, useEffect } from "react";
import { Layout, theme } from "antd";
import HeaderComponent from "@layout/components/header/HeaderComponent";
import SliderComponent from "@layout/components/slider/Slider";
import { Footer } from "antd/es/layout/layout";
import signalR from "@signalR/hub";
import { useSession } from "next-auth/react";

const { Content } = Layout;

interface Props {
  content: ReactNode;
}

const AntdLayout: React.FC<Props> = (props) => {
  const { data: session } = useSession();
  const { content } = props;
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    if (session != null) {
      const newConnection = signalR.connectionServer(session.user.access_token);
      newConnection
        .start()
        .then(() => {
          newConnection.on("newNotify", async (data: any) => {
            // console.log(data);
          });
          newConnection.on("newNotifyCount", async (data: number) => {
            // console.log(data);
          });
        })
        .catch((err) => console.log(err));
      return () => {
        newConnection
          .stop()
          .then(() => {})
          .catch(() => {});
      };
    }
  }, [session]);
  return (
    <Layout className="min-h-screen">
      <HeaderComponent />
      <Layout>
        <SliderComponent />
        <Content
          style={{
            marginTop: "10px",
            marginLeft: "10px",
            marginRight: "10px",
            background: colorBgContainer,
          }}
        >
          <div className="">{content}</div>
        </Content>
      </Layout>
      <Footer style={{ textAlign: "center" }}>Copyright © 2023 QTSC</Footer>
    </Layout>
  );
};

export default AntdLayout;
