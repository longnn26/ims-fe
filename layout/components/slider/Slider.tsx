"use client";
import React, { useEffect } from "react";
import { Layout, Menu, theme } from "antd";
import useSelector from "@hooks/use-selector";
import { sliderMenus } from "@utils/global";
import useDispatch from "@hooks/use-dispatch";
import { setdefaultOpenKeys } from "@slices/global";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { areInArray, getItem } from "@utils/helpers";
import type { MenuProps } from "antd";
import { LaptopOutlined, NotificationOutlined } from "@ant-design/icons";
const { Sider } = Layout;
const SliderComponent: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { collapsed, defaultOpenKey } = useSelector(
    (state) => state.global
  );
  const { data: session } = useSession();

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={245} // Set the width property
      style={{
        background: colorBgContainer,
        marginTop: 10,
      }}
    >
      <div className="demo-logo-vertical" />
      <Menu
        mode="inline"
        selectedKeys={defaultOpenKey}
        // items={sliderMenu.filter((t) =>
        //   areInArray(session?.user.roles!, ...t.roles)
        // )}
        defaultOpenKeys={defaultOpenKey}
        items={sliderMenus}
        onClick={async (info) => {
          dispatch(setdefaultOpenKeys(info.keyPath))
          router.push(`/${info.key}`);
        }}
      />
    </Sider>
  );
};

export default SliderComponent;
