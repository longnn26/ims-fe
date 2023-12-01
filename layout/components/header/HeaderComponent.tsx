/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout, Button, theme } from "antd";
import useSelector from "@hooks/use-selector";
import { setCollapsed, setSliderMenuItemSelectedKey } from "@slices/global";
import useDispatch from "@hooks/use-dispatch";
import { sliderMenu } from "@utils/global";
import { signOut, useSession } from "next-auth/react";
import { Dropdown, Space, Avatar, MenuProps } from "antd";
import { useRouter } from "next/router";
import Head from "next/head";

const { Header } = Layout;

interface Props {}

const HeaderComponent: React.FC<Props> = (props) => {
  const { data: session } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();
  const { collapsed, sliderMenuItemSelectedKey } = useSelector(
    (state) => state.global
  );
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const item = sliderMenu.find((_) => _.key === sliderMenuItemSelectedKey);
  const items: MenuProps["items"] = [
    {
      label: <span>{session?.user.name}</span>,
      key: "0",
    },

    {
      type: "divider",
    },
    {
      label: (
        <span
          onClick={() => {
            dispatch(setSliderMenuItemSelectedKey("server-allocation"));
            signOut();
          }}
        >
          Logout
        </span>
      ),
      key: "2",
    },
  ];

  useEffect(() => {
    switch (router.pathname) {
      case "/server":
        dispatch(setSliderMenuItemSelectedKey("server"));
        break;
      case "/component":
        dispatch(setSliderMenuItemSelectedKey("component"));
        break;
      case "/ipSubnet":
        dispatch(setSliderMenuItemSelectedKey("ipSubnet"));
        break;
      case "/customer":
        dispatch(setSliderMenuItemSelectedKey("customer"));
        break;
      case "/area":
        dispatch(setSliderMenuItemSelectedKey("area"));
        break;
      case "/request":
        dispatch(setSliderMenuItemSelectedKey("request"));
        break;
      case "/appointment":
        dispatch(setSliderMenuItemSelectedKey("appointment"));
        break;
      default:
        break;
    }
    // session && dispatch(getLanguages(session.user.accessToken));
  }, []);
  return (
    <Header
      style={{ padding: 0, background: colorBgContainer }}
      className="flex justify-between"
    >
      <Head>
        <title>{item?.label}</title>
      </Head>
      <div className="flex w-1/3 justify-start items-center">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => dispatch(setCollapsed(!collapsed))}
          style={{
            fontSize: "16px",
            width: 64,
            height: 64,
          }}
        />
        <div className="max-w-screen-xl inline-block flex-wrap items-center justify-between">
          <div className="flex items-center">
            <img
              src="/images/logo.jpeg"
              className="h-14 mr-3"
              alt="FlowBite Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap">
              IMS
            </span>
          </div>
        </div>
      </div>

      <div className="flex w-1/3 justify-center">
        <span className="self-center text-xl font-semibold whitespace-nowrap">
          {item?.label}
        </span>
      </div>

      <div className="flex w-1/3 justify-end pr-3">
        <Dropdown
          menu={{ items }}
          trigger={["click"]}
          className="cursor-pointer"
        >
          <Space>
            <Avatar style={{ backgroundColor: "#fde3cf", color: "#f56a00" }}>
              {session?.user.userName.charAt(0)}
            </Avatar>
          </Space>
        </Dropdown>
      </div>
    </Header>
  );
};

export default HeaderComponent;
