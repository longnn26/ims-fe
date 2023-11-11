"use client";
import React from "react";
import dynamic from "next/dynamic";
const AntdLayoutNoSSR = dynamic(() => import("../../layout/AntdLayout"), {
  ssr: false,
});

const MyAccount: React.FC = () => {
  return (
    <AntdLayoutNoSSR
      content={
        <>
          <h1>My Account</h1>
        </>
      }
    />
  );
};

export default MyAccount;
