"use client";
import React, { ReactNode } from "react";
import { Layout, theme } from "antd";
import HeaderComponent from "@layout/components/header/HeaderComponent";
import SliderComponent from "@layout/components/slider/Slider";
import { Footer } from "antd/es/layout/layout";
import HeaderHomePage from "./components/header/HeaderHomePage";

const { Content } = Layout;

interface Props {
  content: ReactNode;
}

const HomeLayout: React.FC<Props> = (props) => {
  const { content } = props;
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <div className="min-h-screen">
      <HeaderHomePage />
      {content}
    </div>
  );
};

export default HomeLayout;
