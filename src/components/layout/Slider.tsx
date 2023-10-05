"use client";
import React from "react";
import { Layout, Menu, MenuProps, theme } from "antd";
import { setSliderMenuItemSelectedKey } from "@/slices/global";
import { UserOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import useDispatch from "@/hooks/use-dispatch";
import useSelector from "@/hooks/use-selector";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Accounts", "sub1", <UserOutlined />, [
    getItem("All Account", "accounts"),
    getItem("Customer", "customer"),
    getItem("Manager", "manager"),
  ]),
  getItem("Customers", "customers", <UserOutlined />),
  getItem("Tickets", "tickets", <UserOutlined />),
];

const { Sider } = Layout;
const SliderComponent: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { collapsed, sliderMenuItemSelectedKey } = useSelector(
    (state) => state.global
  );

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={{
        marginTop: "16px",
      }}
    >
      <div className="demo-logo-vertical" />
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={[sliderMenuItemSelectedKey]}
        items={items}
        onSelect={async (info) => {
          dispatch(setSliderMenuItemSelectedKey(info.key));
          router.push(` ${info.key === "home" ? `/` : `/${info.key}`}`);
        }}
      />
    </Sider>
  );
};

export default SliderComponent;
