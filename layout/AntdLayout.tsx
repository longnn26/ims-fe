"use client";
import React, { ReactNode } from "react";
import { Layout, theme } from "antd";
import HeaderComponent from "@layout/components/header/HeaderComponent";
import SliderComponent from "@layout/components/slider/Slider";

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
            margin: "10px",
            background: colorBgContainer,
          }}
        >
          <div className="h-screen">{content}</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AntdLayout;
