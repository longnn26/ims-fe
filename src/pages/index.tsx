"use client";
import dynamic from "next/dynamic";
import React from "react";
import { Modal } from "antd";
const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});

const HomePage: React.FC = () => {
  return (
   <div>HomePage</div>
  );
};

export default HomePage;
