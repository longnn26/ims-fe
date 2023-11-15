"use client";
import React, { ReactNode } from "react";
import { Layout, theme } from "antd";
import HeaderComponent from "@layout/components/header/HeaderComponent";
import SliderComponent from "@layout/components/slider/Slider";
import { Footer } from "antd/es/layout/layout";

const { Content } = Layout;

interface Props {
  content: ReactNode;
}

const AntdLayout: React.FC<Props> = (props) => {
  const { content } = props;
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout>
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
          <div className="h-screen">{content}</div>
        </Content>
      </Layout>
      <Footer style={{ textAlign: "center" }}>Copyright © 2023 QTSC</Footer>
    </Layout>
  );
};

export default AntdLayout;
