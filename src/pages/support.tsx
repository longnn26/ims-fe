"use client";
import dynamic from "next/dynamic";
import React from "react";
import { Modal } from "antd";
const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});
const { confirm } = Modal;

const Support: React.FC = () => {
  return (
    <AntdLayoutNoSSR
      content={
        <>
          <div className="flex justify-between mb-4 p-2 bg-[#f8f9fa]/10 border border-gray-200 rounded-lg shadow-lg shadow-[#e7edf5]/50"></div>
        </>
      }
    />
  );
};

export default Support;
