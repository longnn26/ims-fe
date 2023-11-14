"use client";
import React, { useEffect } from "react";
import { Layout, Menu, theme } from "antd";
import useSelector from "@hooks/use-selector";
import { sliderMenu } from "@utils/global";
import useDispatch from "@hooks/use-dispatch";
import { setSliderMenuItemSelectedKey } from "@slices/global";
import { useRouter } from "next/router";

const { Sider } = Layout;
const SliderComponent: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { collapsed, sliderMenuItemSelectedKey } = useSelector(
    (state) => state.global
  );

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={{ background: colorBgContainer, marginTop: 10 }}
    >
      <div className="demo-logo-vertical" />
      <Menu
        mode="inline"
        selectedKeys={[sliderMenuItemSelectedKey]}
        items={sliderMenu}
        onClick={async (info) => {
          dispatch(setSliderMenuItemSelectedKey(info.key));
          router.push(`/${info.key}`);
        }}
      />
    </Sider>
  );
};

export default SliderComponent;
