"use client";

import styles from "@/styles/header.module.css";
import HeaderComponent from "@/components/layout/Header";
import { Layout, theme } from "antd";
import React, { ReactNode } from "react";
import store from "@/store";
import { persistStore } from "redux-persist";
import { Provider } from "react-redux";
import SliderComponent from "@/components/layout/Slider";

const { Content } = Layout;

interface Props {
  content: ReactNode;
}
let persistor = persistStore(store);

const Home: React.FC<Props> = (props) => {
  const { content } = props;
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Provider store={store}>
      <Layout>
        <HeaderComponent />
        <Layout className={styles["ant-layout"]}>
          <SliderComponent />
          <Content
            style={{
              margin: "16px",
              background: colorBgContainer,
            }}
          >
            <div className="h-screen">{content}</div>
          </Content>
        </Layout>
      </Layout>
    </Provider>
  );
};

export default Home;
