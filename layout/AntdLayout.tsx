"use client";
import React, { ReactNode, useEffect } from "react";
import { Layout, theme } from "antd";
import HeaderComponent from "@layout/components/header/HeaderComponent";
import SliderComponent from "@layout/components/slider/Slider";
import { Footer } from "antd/es/layout/layout";
import { useRouter } from "next/router";
import useDispatch from "@hooks/use-dispatch";
import { setdefaultOpenKeys } from "@slices/global";

const { Content } = Layout;

interface Props {
  content: ReactNode;
}

const AntdLayout: React.FC<Props> = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { content } = props;
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    switch (router.pathname) {
      case "/lots-serial-numbers":
        dispatch(setdefaultOpenKeys(["lots-serial-numbers", "product"]));
        break;
      case "/product-variants":
        dispatch(setdefaultOpenKeys(["product-variants", "product"]));
        break;
      case "/products":
        dispatch(setdefaultOpenKeys(["products", "product"]));
        break;
      case "/receipts":
        dispatch(setdefaultOpenKeys(["receipts", "transfers"]));
        break;
      case "/internal":
        dispatch(setdefaultOpenKeys(["internal", "transfers"]));
        break;
      case "/deliveries":
        dispatch(setdefaultOpenKeys(["deliveries", "transfers"]));
        break;
      case "/warehouses":
        dispatch(setdefaultOpenKeys(["warehouses"]));
        break;
      case "/profile":
        dispatch(setdefaultOpenKeys(["profile", "configuration"]));
        break;
      case "/units-of-measure":
        dispatch(setdefaultOpenKeys(["units-of-measure", "configuration"]));
        break;
      case "/product-categories":
        dispatch(setdefaultOpenKeys(["product-categories", "configuration"]));
        break;
      default:
        break;
    }
  }, [dispatch, router.pathname]);

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
            padding: "10px",
          }}
        >
          <div className="">{content}</div>
        </Content>
      </Layout>
      <Footer style={{ textAlign: "center" }}>
        Copyright © 2024 khoserver
      </Footer>
    </Layout>
  );
};

export default AntdLayout;
