"use client";
import dynamic from "next/dynamic";
import React from "react";
const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});

const MovesHistoryPage: React.FC = () => {
  return <AntdLayoutNoSSR content={<></>} />;
};

export default MovesHistoryPage;
