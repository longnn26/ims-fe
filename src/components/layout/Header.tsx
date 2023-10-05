"use client";
import styles from "@/styles/header.module.css";
import React, { ReactNode, useEffect, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, theme, Row, Col, Avatar } from "antd";
import { setCollapsed, setSliderMenuItemSelectedKey } from "@/slices/global";
import { useRouter } from "next/navigation";
import useDispatch from "@/hooks/use-dispatch";
import useSelector from "@/hooks/use-selector";
import { MenuProps } from "antd/lib";

const { Header, Sider, Content } = Layout;

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
    getItem("All Account", "account"),
    getItem("Customer", "customer"),
    getItem("Manager", "manager"),
  ]),
];

const HeaderComponent: React.FC = () => {
  const dispatch = useDispatch();
  const { collapsed, sliderMenuItemSelectedKey } = useSelector(
    (state) => state.global
  );

  return (
    <>
      <Header
        style={{
          position: "sticky",
          width: "100%",
          alignItems: "center",
          padding: "0",
        }}
      >
        <div className="demo-logo" />
        <Row>
          <Col md={18}>
            <Button
              type="text"
              icon={
                collapsed ? (
                  <MenuUnfoldOutlined style={{ color: "#ffffff" }} />
                ) : (
                  <MenuFoldOutlined style={{ color: "#ffffff" }} />
                )
              }
              onClick={() => dispatch(setCollapsed(!collapsed))}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
          </Col>
          <Col md={6}>
            <div style={{ textAlign: "end" }}>
              <Avatar size="default" icon={<UserOutlined />}>
                Trần Anh Tuấn
              </Avatar>
            </div>
          </Col>
        </Row>
      </Header>
    </>
  );
};

export default HeaderComponent;
