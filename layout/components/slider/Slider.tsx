"use client";
import React, { useEffect } from "react";
import { Layout, Menu, theme } from "antd";
import useSelector from "@hooks/use-selector";
import { sliderMenu } from "@utils/global";
import useDispatch from "@hooks/use-dispatch";
import { setSliderMenuItemSelectedKey } from "@slices/global";
import { useRouter } from "next/router";
import { ROLE_TECH } from "@utils/constants";
import { useSession } from "next-auth/react";
import { areInArray } from "@utils/helpers";

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
        selectedKeys={[sliderMenuItemSelectedKey]}
        items={sliderMenu.filter((t) =>
          areInArray(session?.user.roles!, ...t.roles)
        )}
        onClick={async (info) => {
          dispatch(setSliderMenuItemSelectedKey(info.key));
          router.push(`/${info.key}`);
        }}
      />
    </Sider>
  );
};

export default SliderComponent;
